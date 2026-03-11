import express from "express";
import passport from "passport";
import { UserRole } from "../constants.js";
import { authMiddleware } from "../middlwares/authMiddleware.js";
import { Signup , login, googleLoginSuccess} from "../controllers/auth.controller.js";
import  validate from "../middlwares/validate.js";
import { signupSchema , loginSchema} from "../validators/user.validator.js";
import {idValidator} from '../validators/common.validator.js'

const router = express.Router();


router.post('/login', validate(loginSchema) ,login);

router.post('/signup',  validate(signupSchema),authMiddleware( UserRole.ADMIN),Signup);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt:'select_account',
    session: false
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.frontendURL}/login`
  }),
  googleLoginSuccess
);

export default router;