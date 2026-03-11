import express from "express";
import { UserRole } from "../constants.js";
import { authMiddleware } from "../middlwares/authMiddleware.js";
import {  createTask , getAllTasks , getTask , deleteTask,updateTask } from "../controllers/task.controller.js";
import  validate from "../middlwares/validate.js";
import {idValidator} from '../validators/common.validator.js'
import {createTaskSchema , updateTaskSchema } from "../validators/task.validator.js";

const router = express.Router();

router.post("/" , validate(createTaskSchema) ,authMiddleware(UserRole.USER), createTask);
router.get("/" ,authMiddleware(UserRole.USER ), getAllTasks);
router.get('/:id' , validate(idValidator, 'params') ,authMiddleware(UserRole.USER), getTask);
router.delete('/:id' , validate(idValidator, 'params') ,authMiddleware(UserRole.USER), deleteTask);
router.put('/:id', validate(updateTaskSchema) ,validate(idValidator, 'params'),authMiddleware(UserRole.USER), updateTask);

export default router;