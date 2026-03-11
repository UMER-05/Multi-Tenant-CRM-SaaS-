import Stage from "../models/stage.model.js";
import Pipeline from "../models/pipeline.model.js";
import {
  createdResponse,
  serverErrorResponse,
  notFoundResponse,
  successResponse,
} from "../utils/responses.js";

const createStage = async (req, res) => {
  const { name, pipeline_id, order } = req.body;
  try {
    const pipeline = await Pipeline.findOne({
      where: { id: pipeline_id, tenant_id: req.user.tenant_id },
    });
    if (!pipeline) {
      return notFoundResponse(res, "Pipeline not found or not authorized");
    }

    const newStage = await Stage.create({
      name,
      pipeline_id,
      order,
      tenant_id: req.user.tenant_id,
    });
    return createdResponse(res, "Stage created successfully", newStage);
  } catch (error) {
    return serverErrorResponse(
      res,
      "An error occurred while creating the stage"
    );
  }
};

const getAllStages = async (req, res) => {
  const id = req.params.id;
  try {
    const stages = await Stage.findAll({
      where: { pipeline_id: id, tenant_id: req.user.tenant_id },
      order: [["order", "ASC"]],
    });

    

    return successResponse(res, "Stages fetched successfully", stages);
  } catch (error) {
    console.error(error);
    return serverErrorResponse(res, "An error occurred while fetching stages");
  }
};

const getStage = async (req, res) => {
  const { id } = req.params;
  try {
    const stage = await Stage.findOne({
      where: { id, tenant_id: req.user.tenant_id },
      include: [{ model: Pipeline, attributes: ["id", "name"] }],
    });

    if (!stage) {
      return notFoundResponse(res, "Stage not found");
    }

    return successResponse(res, "Stage fetched successfully", stage);
  } catch (error) {
    console.error(error);
    return serverErrorResponse(
      res,
      "An error occurred while fetching the stage"
    );
  }
};

const deleteStage = async (req, res) => {
  const { id } = req.params;
  try {
    const stage = await Stage.findOne({
      where: { id,  tenant_id: req.user.tenant_id },
    });

    if (!stage) {
      return notFoundResponse(res, "Stage not found or not authorized");
    }

    await stage.destroy();

    return successResponse(res, "Stage deleted successfully", null);
  } catch (error) {
    console.error(error);
    return serverErrorResponse(
      res,
      "An error occurred while deleting the stage"
    );
  }
};

const updateStage = async (req, res) => {
  const { name, pipeline_id, order } = req.body;
  const id = req.params.id;
  try {
    const stage = await Stage.findOne({
      where: { id, tenant_id: req.user.tenant_id },
    });

    if (!stage) {
      return notFoundResponse(res, "Stage not found");
    }
    if (pipeline_id) {
      const pipeline = await Pipeline.findOne({
        where: { id: pipeline_id, tenant_id: req.user.tenant_id },
      });
      if (!pipeline) {
        return notFoundResponse(res, "Pipeline not found or not authorized");
      }
    }

    await stage.update({
      name: name || stage.name,
      pipeline_id: pipeline_id || stage.pipeline_id,
      order: order || stage.order,
    });

    return successResponse(res, "Stage updated successfully", stage);
  } catch (error) {
    return serverErrorResponse(
      res,
      "Internal server error while updating Stage"
    );
  }
};

export { createStage, getAllStages, getStage, deleteStage, updateStage };