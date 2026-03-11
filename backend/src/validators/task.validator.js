import Joi from "joi"


export const createTaskSchema = Joi.object({
    taskName: Joi.string().max(70).required(),
    description: Joi.string(),
    status: Joi.string().valid( 'completed' , 'pending', 'in_progress').default('pending').required(),
    priority: Joi.string().valid( 'Urgent', 'High', 'Medium', 'Low').default('Medium').required(),
    assigned_lead:Joi.string().uuid().required(),
    assigned_user:Joi.string().uuid().required(),
    due_date: Joi.date().iso()})


export const updateTaskSchema = Joi.object({
    taskName: Joi.string().max(70),
    description: Joi.string(),
    status: Joi.string().valid( 'completed' , 'pending', 'in_progress').default('pending').required(),
    priority: Joi.string().valid( 'Urgent', 'High', 'Medium', 'Low').default('Medium').required(),
    assigned_user:Joi.string().uuid().required(),
    assigned_lead:Joi.string().uuid().required(),
    due_date: Joi.date().iso()
})