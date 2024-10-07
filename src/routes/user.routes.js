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
} from "../controllers/user.controller.js";

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
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);

export default router;
