import express from "express";
import { UserRole } from "../constants.js";
import { authMiddleware } from "../middlwares/authMiddleware.js";
import { createPipeline, getAllPipelines, getPipeline, deletePipeline, updatePipeline } from "../controllers/pipeline.controller.js";
import validate from "../middlwares/validate.js";
import { idValidator } from '../validators/common.validator.js';
import { createPipelineSchema, updatePipelineSchema } from "../validators/pipeline.validator.js";

const router = express.Router();

router.post("/", validate(createPipelineSchema), authMiddleware(UserRole.ADMIN), createPipeline);
router.get("/", authMiddleware(UserRole.USER), getAllPipelines);
router.get('/:id', validate(idValidator, 'params'), authMiddleware(UserRole.USER), getPipeline);
router.delete('/:id', validate(idValidator, 'params'), authMiddleware(UserRole.ADMIN), deletePipeline);
router.put('/:id', validate(updatePipelineSchema), validate(idValidator, 'params'), authMiddleware(UserRole.ADMIN), updatePipeline);

export default router;