import express from "express";
import upload from '../middlwares/multerMiddleware.js'
import { authMiddleware } from "../middlwares/authMiddleware.js";
import { uploadTaskAttachments,getTaskAttachments } from "../controllers/taskAttachments.controller.js";
import { UserRole } from "../constants.js";

const router = express.Router();

router.post( "/:taskId",authMiddleware(UserRole.USER), upload.array("files", 5), uploadTaskAttachments);
router.get( "/:taskId",authMiddleware(UserRole.USER), getTaskAttachments);

export default router;