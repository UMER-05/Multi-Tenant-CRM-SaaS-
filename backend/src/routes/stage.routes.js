import express from "express";
import { UserRole } from "../constants.js";
import { authMiddleware } from "../middlwares/authMiddleware.js";
import { createStage, getAllStages, getStage, deleteStage, updateStage } from "../controllers/stage.controller.js";
import validate from "../middlwares/validate.js";
import { idValidator } from '../validators/common.validator.js';
import { createStageSchema, updateStageSchema } from "../validators/stage.validator.js";

const router = express.Router();

router.post("/", validate(createStageSchema), authMiddleware(UserRole.ADMIN), createStage);
router.get("/:id" , validate(idValidator, 'params'), authMiddleware(UserRole.USER), getAllStages);
router.get('/id/:id', validate(idValidator, 'params'), authMiddleware(UserRole.USER), getStage);
router.delete('/:id', validate(idValidator, 'params'), authMiddleware(UserRole.ADMIN), deleteStage);
router.put('/:id', validate(updateStageSchema), validate(idValidator, 'params'), authMiddleware(UserRole.ADMIN), updateStage);

export default router;