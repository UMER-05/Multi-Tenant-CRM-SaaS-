import Task from "../models/task.model.js";
import {User} from '../models/associations.js'
import TaskNote from "../models/taskNotes.model.js";
import {
  createdResponse,
  serverErrorResponse,
  notFoundResponse,
  successResponse,
} from "../utils/responses.js";

const createTaskNote = async (req, res) => {
  try {
    const { task_id, content } = req.body;
  console.log("task Note data", req.body);
    const task = await Task.findOne({ where: { id: task_id , tenant_id : req.user.tenant_id } });

    if (!task) {
      return notFoundResponse(res, "Task not found");
    }
    const newTaskNote = await TaskNote.create({
      task_id,
      content,
      tenant_id: req.user.tenant_id,
      created_by: req.user.id,
    });
    
    return createdResponse(res, "Task note created successfully", newTaskNote);
    
  } catch (error) {
    console.log('error:',error)
    return serverErrorResponse(
      res,
      "Internal server error while creating Task Note"
    );
  }
};


const getAllTaskNotes= async (req, res) => {
    try {
    const { id } = req.params;

    const taskNotes = await TaskNote.findAll({
      where: { task_id: id, tenant_id: req.user.tenant_id },
      include: [{ model: User,as:'createdBy' ,attributes: ['id', 'full_name'] }],
    });
        
    return successResponse(res, "Task notes fetched successfully", taskNotes);
    
    } catch (error) {
      console.log('errorr:',error)
         return serverErrorResponse(
      res,
      "Internal server error while getting task notes",
    );

  }
};


export { createTaskNote , getAllTaskNotes };
