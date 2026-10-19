import Joi from "joi";
import {UserRole} from "../constants.js";

export const signupSchema = Joi.object({
  full_name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.number().valid(UserRole.USER, UserRole.ADMIN , UserRole.SUPERADMIN).default(UserRole.USER).required(),
  tenant_id: Joi.string(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(200).required(),
});

export const updateUserSchema = Joi.object({
  full_name: Joi.string().min(3).max(30),
  email: Joi.string().email(),
  password: Joi.string().min(6).max(200).allow('').optional(),
  role: Joi.number().valid(UserRole.USER, UserRole.ADMIN , UserRole.SUPERADMIN)
});


