import Joi from "joi";

export const createStageSchema = Joi.object({
  name: Joi.string().max(100).required(),
  pipeline_id: Joi.string().uuid().required(),
  order: Joi.number().integer().min(1).required(),
});

export const updateStageSchema = Joi.object({
  name: Joi.string().max(100),
  pipeline_id: Joi.string().uuid(),
  order: Joi.number().integer().min(1),
});