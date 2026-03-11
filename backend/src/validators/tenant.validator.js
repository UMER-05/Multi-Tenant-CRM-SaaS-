import Joi from "joi";


export const createTenantSchema = Joi.object({
    name: Joi.string().min(3).max(25).required(),
    address:Joi.string().max(100),
    contact_email: Joi.string().max(40).required(),
    phone: Joi.string().min(5).max(30)
})


export const updateTenantSchema = Joi.object({
    name: Joi.string().min(3).max(25),
    address:Joi.string().max(100),
    contact_email: Joi.string().max(40),
    phone: Joi.string().min(5).max(30),
    isActive: Joi.boolean()
})

