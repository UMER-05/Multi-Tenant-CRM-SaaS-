import Joi from "joi";

export const createLeadSchema = Joi.object({
  name: Joi.string().max(100).required(),
  contact_info: Joi.string().required(),
  source: Joi.string().required(),
  expected_value: Joi.number().precision(2).min(0),
  assigned_user_id: Joi.string().uuid(),
  pipeline_id: Joi.string().uuid().required(),
  pipeline_stage_id: Joi.string().uuid().required(),
  status: Joi.string().valid("open", "closed").default("open"),
  outcome: Joi.string().valid("win", "lose", "pending"),
});

export const updateLeadSchema = Joi.object({
  name: Joi.string().max(100),
  contact_info: Joi.string(),
  source: Joi.string(),
  expected_value: Joi.number().precision(2).min(0),
  assigned_user_id: Joi.string().uuid(),
  pipeline_id: Joi.string().uuid(),
  pipeline_stage_id: Joi.string().uuid(),
  status: Joi.string().valid("open", "closed"),
  outcome: Joi.string().valid("win", "lose", "pending"),
});