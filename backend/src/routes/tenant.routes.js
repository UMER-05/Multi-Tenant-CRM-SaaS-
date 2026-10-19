import express from "express";
import { UserRole } from "../constants.js";
import { authMiddleware } from "../middlwares/authMiddleware.js";
import { createTenantSchema ,updateTenantSchema } from "../validators/tenant.validator.js";
import  validate from "../middlwares/validate.js";
import {idValidator} from '../validators/common.validator.js'

import {
    createTenant,
    getAllTenants,
    getTenant,
    updateTenant,
    deleteTenant
} from "../controllers/tenant.controller.js";

const router = express.Router();

router.post("/", validate(createTenantSchema) , authMiddleware(UserRole.SUPERADMIN), createTenant);
router.get("/", authMiddleware(UserRole.SUPERADMIN), getAllTenants);
router.get("/:id",validate(idValidator, 'params') , authMiddleware(UserRole.SUPERADMIN), getTenant);
router.put("/:id", validate(updateTenantSchema),validate(idValidator, 'params') ,authMiddleware(UserRole.SUPERADMIN), updateTenant);
router.delete("/:id", validate(updateTenantSchema) , validate(idValidator, 'params'),authMiddleware(UserRole.SUPERADMIN), deleteTenant);

export default router;