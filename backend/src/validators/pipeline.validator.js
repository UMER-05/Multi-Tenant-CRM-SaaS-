import Joi from "joi";

export const createPipelineSchema = Joi.object({
  name: Joi.string().max(100).required(),
});

export const updatePipelineSchema = Joi.object({
  name: Joi.string().max(100),
});