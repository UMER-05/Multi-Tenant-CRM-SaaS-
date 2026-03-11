import express from "express";
import { UserRole } from "../constants.js";
import { authMiddleware } from "../middlwares/authMiddleware.js";
import { createLead, getAllLeads, getLead, deleteLead, updateLead,getAllLeadsByPipelineId } from "../controllers/lead.controller.js";
import validate from "../middlwares/validate.js";
import { idValidator } from '../validators/common.validator.js';
import { createLeadSchema, updateLeadSchema } from "../validators/lead.validator.js";

const router = express.Router();

router.post("/", validate(createLeadSchema), authMiddleware(UserRole.ADMIN), createLead);
router.get("/", authMiddleware(UserRole.USER), getAllLeads);
router.get('/:id', validate(idValidator, 'params'), authMiddleware(UserRole.USER), getLead);
router.delete('/:id', validate(idValidator, 'params'), authMiddleware(UserRole.ADMIN), deleteLead);
router.put('/:id', validate(updateLeadSchema), validate(idValidator, 'params'), authMiddleware(UserRole.ADMIN), updateLead);
router.get('/pipeline/:id', validate(idValidator, 'params'), authMiddleware(UserRole.USER), getAllLeadsByPipelineId);
export default router;