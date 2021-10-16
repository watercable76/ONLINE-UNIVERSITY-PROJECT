const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");
const User = require("../models/user");
const { check, body } = require("express-validator");

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please enter a valid email.").normalizeEmail(),
    body("password", "Please enter a password with only numbers and text at least 5 characters long")
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
  ],
  authController.postLogin
);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        console.log(value);
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Email already exists, please pick a different one.");
          }
        });
      })
      .normalizeEmail(),
    body("password", "Please enter a password with only numbers and text at least 5 characters long")
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body("confirmPassword")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords have to match!");
        }
        return true;
      })
      .trim(),
  ],
  authController.postSignup
);

router.post("/logout", authController.postLogout);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
