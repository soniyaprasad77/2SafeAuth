import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Session } from "../models/session.model.js"; // Import the session model
import { ApiResponse } from "../utils/ApiResponse.js";
import { validationResult } from "express-validator";
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import jwt from "jsonwebtoken";
import useragent from "useragent";
const generateAccessAndRefreshTokens = async (userId) => {
  const user = await User.findById(userId);
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;
  user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation - not empty
  // check if user already exists: username, email
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullName, email, username, password } = req.body;

  console.log("email: ", email);

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const user = await User.create({
    fullName,
    email,
    password,
    username: username.toLowerCase(),
  });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  /*
      1. get data from user (body)
      2. check with username or email whether it exists or not
      3. find the user
      4. password check
      5. if 2FA is enabled, verify OTP
      6. generate access and refresh token
      7. send cookie
      */

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password, email, token } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "Username or email is required");
  }

  // Find the user by username or email
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(400, "User does not exist");
  }

  // Check if the password is valid
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid User Credentials");
  }

  // Check if 2FA is enabled for this user
  if (user.twoFactorEnabled) {
    if (!token) {
      // If 2FA is enabled and no OTP is provided, return an error
      throw new ApiError(400, "Two-factor authentication token is required");
    }

    // Verify the OTP token using speakeasy
    const isOtpValid = speakeasy.totp.verify({
      secret: user.twoFactorSecret, // Stored 2FA secret
      encoding: "base32",
      token, // OTP token from the request body
    });

    if (!isOtpValid) {
      throw new ApiError(400, "Invalid 2FA token");
    }
  }

  // Generate access and refresh tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );
  const userAgent = useragent.parse(req.headers["user-agent"]);
  const ipAddress = req.ip || req.connection.remoteAddress;

  // Create a new session
  await Session.create({
    userId: user._id,
    deviceType: userAgent.device.toString(),
    browser: userAgent.toAgent(),
    ipAddress,
  });

  // Fetch the user without password and refreshToken fields
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // Set cookie options
  const options = {
    httpOnly: true,
    secure: true,
  };

  // Send access token and refresh token in cookies and return user data
  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User Logged in Successfully"
      )
    );
});
const getActiveSessions = asyncHandler(async (req, res) => {
  const sessions = await Session.find({ userId: req.user.id, isActive: true });
  res.status(200).json({
    status: "success",
    sessions,
  });
});
const logoutFromSession = asyncHandler(async (req, res) => {
  const sessionId = req.params.sessionId;
  const session = await Session.findById(sessionId);

  if (!session || session.userId.toString() !== req.user.id) {
    return res.status(404).json({ message: "Session not found" });
  }

  session.isActive = false;
  await session.save();

  res.status(200).json({
    status: "success",
    message: "Session terminated successfully",
  });
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefereshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

// for changing current password

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid Old Password");
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

// get current user
const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;
  if (!fullName || !email) {
    throw new ApiError(400, "All feilds are required");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
        email: email,
      },
    },
    { new: true }
  ).select("-password");
  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account Details updated Successfully"));
});
const setup2FA = asyncHandler(async (req, res) => {
  const { username } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Generate 2FA secret key
    const secret = speakeasy.generateSecret({ name: `YourApp (${username})` });

    // Store the secret key for the user
    user.twoFactorSecret = secret.base32;
    await user.save();

    // Generate a QR code
    qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
      if (err) {
        return res.status(500).send("Error generating QR code");
      }

      res.json({
        message: "2FA enabled",
        qrCode: data_url, // QR code to scan with Google Authenticator
        secret: secret.base32, // Secret for backup (optional)
      });
    });
  } catch (error) {
    res.status(500).send("Error enabling 2FA");
  }
});
const verifyOTP = asyncHandler(async (req, res) => {
  const { username, token } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send("User not found");
    }

    if (!user.twoFactorSecret) {
      return res.status(400).send("2FA not enabled for this user");
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token, // OTP from user
    });

    if (verified) {
      res.send("OTP is valid");
    } else {
      res.status(400).send("Invalid OTP");
    }
  } catch (error) {
    res.status(500).send("Error verifying OTP");
  }
});

const toggle2FA = asyncHandler(async (req, res) => {
  const { username } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send("User not found");
    }

    user.twoFactorSecret = null;
    user.twoFactorEnabled = !user.twoFactorEnabled;
    await user.save();
    if (user.twoFactorEnabled) {
      res.send("2FA is enabled successfully");
    } else {
      res.send("2FA is disabled successfully");
    }
  } catch (error) {
    res.status(500).send("Error disabling 2FA");
  }
});
export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  setup2FA,
  verifyOTP,
  toggle2FA,
  getActiveSessions,
  logoutFromSession,
};
