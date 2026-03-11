import express from 'express'
import { getAllUsers ,getUser, updateUser, deleteUser, getMe} from "../controllers/user.controller.js";
import { authMiddleware } from '../middlwares/authMiddleware.js';
import { UserRole } from '../constants.js';
import  validate from "../middlwares/validate.js";
import { updateUserSchema ,  } from "../validators/user.validator.js";
import {idValidator} from '../validators/common.validator.js'

const router = express.Router();

router.get('/me',authMiddleware(UserRole.USER), getMe);
router.get('/all/:id',validate(idValidator , 'params'), authMiddleware(UserRole.ADMIN), getAllUsers);
router.get('/:id', validate(idValidator, 'params'),   authMiddleware(UserRole.ADMIN), getUser);
router.put('/:id',  validate(updateUserSchema), validate(idValidator , 'params'),authMiddleware(UserRole.ADMIN), updateUser);
router.delete('/:id', validate(idValidator , 'params'),  authMiddleware(UserRole.ADMIN), deleteUser);


export default router;