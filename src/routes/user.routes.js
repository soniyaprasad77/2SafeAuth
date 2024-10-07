import { Router } from "express";
import { check } from "express-validator";
import { verifyJWT } from "../middlewares/auth.middleware.js";


import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  setup2FA,
  verifyOTP,
} from "../controllers/user.controller.js";
import { toggle2FA } from "../controllers/user.controller.js";

const router = Router();

router
  .route("/register")
  .post(
    [
      check("fullName").notEmpty().withMessage("Full name is required"),
      check("email").isEmail().withMessage("Please enter a valid email"),
      check("username").notEmpty().withMessage("Username is required"),
      check("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    ],
    registerUser
  );

router
  .route("/login")
  .post(
    [
      check("username").notEmpty().withMessage("Username is required"),
      check("password").notEmpty().withMessage("Password is required"),
    ],
    loginUser
  );
router.route("/enable-2fa").post( verifyJWT, setup2FA);
router.route("/verify-otp").post(verifyJWT, verifyOTP);
router.route("/toggle-2fa").post(verifyJWT, toggle2FA);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);

export default router;
