import Task from "../models/task.model.js";
import { User ,Lead} from "../models/associations.js";

import {
  createdResponse,
  serverErrorResponse,
  notFoundResponse,
  successResponse,
} from "../utils/responses.js";

const createTask = async (req, res) => {
  const { taskName, description, status,priority,assigned_user,assigned_lead ,due_date} = req.body;
  console.log("task req data", req.body);
  try {
    const newTask = await Task.create({
      taskName,
      description,
      status,
      priority,
      assigned_user,
      assigned_lead,
      due_date,
      created_by: req.user.id,
      tenant_id: req.user.tenant_id,
      updated_by: req.user.id,
    });
    return createdResponse(res, "Task created successfully", newTask);
  } catch (error) {
    return serverErrorResponse(
      res,
      "An error occurred while creating the task"
    );
  }
};

const getAllTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: tasks } = await Task.findAndCountAll({
      where: { tenant_id: req.user.tenant_id },
      include: [
        { model: User, as: "createdBy", attributes: ["id", "full_name"] },
        { model: User, as: "updatedBy", attributes: ["id", "full_name"] },
        { model: User, as: "assignedUser", attributes: ["id", "full_name"] },
        { model: Lead, as: "assignedLead", attributes: ["id", "name"] },
      ],
      offset,
      limit,
    });

    if (count === 0) {
      return notFoundResponse(res, "No tasks found");
    }

    const totalPages = Math.ceil(count / limit);

    return successResponse(res, "Tasks fetched successfully", {
      totalItems: count,
      totalPages,
      currentPage: page,
      pageSize: limit,
      tasks,
    });
  } catch (error) {
    console.error(error);
    return serverErrorResponse(res, "An error occurred while fetching tasks");
  }
};

const getTask = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findOne({
      where: { id, tenant_id: req.user.tenant_id },
      include: [
        { model: User, as: "createdBy", attributes: ["id", "full_name"] },
        { model: User, as: "updatedBy", attributes: ["id", "full_name"] },
        { model: User, as: "assignedUser", attributes: ["id", "full_name"] },
        { model: Lead, as: "assignedLead", attributes: ["id", "name"] },
      ],
    });

    if (!task) {
      return notFoundResponse(res, "Task not found");
    }

    return successResponse(res, "Task fetched successfully", task);
  } catch (error) {
    console.error(error);
    return serverErrorResponse(
      res,
      "An error occurred while fetching the task"
    );
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findOne({
      where: { id, tenant_id: req.user.tenant_id },
    });

    if (!task) {
      return notFoundResponse(res, "Task not found or not authorized");
    }

    await task.destroy();

    return successResponse(res, "Task deleted successfully", null);
  } catch (error) {
    console.error(error);
    return serverErrorResponse(
      res,
      "An error occurred while deleting the task"
    );
  }
};

const updateTask = async (req, res) => {
  const { taskName, description, status,priority,assigned_user,assigned_lead ,due_date} = req.body;
  const id = req.params.id;
  console.log("updateData:", req.body, id);
  try {
    const task = await Task.findOne({
      where: { id, tenant_id: req.user.tenant_id },
    });

    if (!task) {
      return notFoundResponse(res, "Task not found");
    }

    task.update({
      taskName: taskName || task.taskName,
      description: description || task.description,
      status: status || task.status,
      priority:priority || task.priority,
      assigned_user:assigned_user || task.assigned_user,
      assigned_lead:assigned_lead || task.assigned_lead ,
      due_date: due_date || task.due_date ,
      updated_by: req.user.id,
    });

    return successResponse(res, "Task updated successfully", task);
  } catch (error) {
    return serverErrorResponse(
      res,
      "Internal server error while updating Task"
    );
  }
};

export { createTask, getAllTasks, getTask, deleteTask, updateTask };
