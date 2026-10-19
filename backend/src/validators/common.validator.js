import Joi from "joi"

export const idValidator = Joi.object({
  id: Joi.string().required(),
});