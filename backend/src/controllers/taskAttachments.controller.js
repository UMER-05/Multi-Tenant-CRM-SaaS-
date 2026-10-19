import Task from "../models/task.model.js";
import TaskNoteAttachment from "../models/taskAttachments.model.js";
import { uploadFile } from "../services/cloudinary.service.js";
import { User } from "../models/associations.js";

import {
  createdResponse,
  serverErrorResponse,
  notFoundResponse,
  successResponse,
} from "../utils/responses.js";

const uploadTaskAttachments = async (req, res) => {
  try {
    const { taskId } = req.params;
    const tenantId = req.user.tenant_id;

    const task = await Task.findOne({
      where: { id: taskId, tenant_id: tenantId },
    });

    if (!task) {
      notFoundResponse(res, "Task not found");
    }

    const attachments = [];

    for (const file of req.files) {
      const uploaded = await uploadFile({
        filePath: file.path,
        folder: `tenants/${tenantId}/tasks/${taskId}`,
        // originalname: file.originalname
      });

      const attachment = await TaskNoteAttachment.create({
        tenant_id: tenantId,
        task_id: taskId,
        uploaded_by: req.user.id,

        file_name: file.originalname,
        file_url: uploaded.file_url,
        public_id: uploaded.public_id,
        file_type: uploaded.file_type,
        file_size: uploaded.file_size,
      });

      attachments.push(attachment);
    }

    return successResponse(res, "Attachments added successfully", attachments);
  } catch (error) {
    console.error(error);
    return serverErrorResponse(
      res,
      "An error occurred while uploading the Attachment"
    );
  }
};

const getTaskAttachments = async (req, res) => {
  try {
    const { taskId } = req.params;
    const tenantId = req.user.tenant_id;

    const task = await Task.findOne({
      where: { id: taskId, tenant_id: tenantId },
    });

    if (!task) return notFoundResponse(res, "Task not found");

    const attachments = await TaskNoteAttachment.findAll({
      where: { task_id: taskId, tenant_id: tenantId },
      attributes: {
    exclude: ["public_id", "tenant_id",  "updatedAt"],
  },
      include: [
        { model: User, attributes: ["full_name"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    return successResponse(
      res,
      "Task Attachments fetched successfully",
      attachments
    );
  } catch (err) {
    console.error(err);
    return serverErrorResponse(
      res,
`      "Internal server error while getting task attachments ${err}
`    );
  }
};

export { uploadTaskAttachments, getTaskAttachments };
