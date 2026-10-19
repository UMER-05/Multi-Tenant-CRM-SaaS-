import express from "express";
import { UserRole } from "../constants.js";
import { authMiddleware } from "../middlwares/authMiddleware.js";
import { createTaskNote , getAllTaskNotes } from "../controllers/taskNote.controller.js";

const router = express.Router();

router.post("/" ,authMiddleware(UserRole.USER), createTaskNote);
router.get('/:id' ,authMiddleware(UserRole.USER), getAllTaskNotes);

export default router;