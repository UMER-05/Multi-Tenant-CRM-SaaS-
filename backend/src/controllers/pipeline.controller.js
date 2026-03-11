import Pipeline from "../models/pipeline.model.js";
import {
  createdResponse,
  serverErrorResponse,
  notFoundResponse,
  successResponse,
} from "../utils/responses.js";

const createPipeline = async (req, res) => {
  const { name } = req.body;
  try {
    const newPipeline = await Pipeline.create({
      name,
      tenant_id: req.user.tenant_id,
    });
    return createdResponse(res, "Pipeline created successfully", newPipeline);
  } catch (error) {
    return serverErrorResponse(
      res,
      "An error occurred while creating the pipeline"
    );
  }
};

const getAllPipelines = async (req, res) => {
  try {
    const pipelines = await Pipeline.findAll({
      where: { tenant_id: req.user.tenant_id },
    });

    if (pipelines.length === 0) {
      return notFoundResponse(res, "No pipelines found");
    }

    return successResponse(res, "Pipelines fetched successfully", pipelines);
  } catch (error) {
    console.error(error);
    return serverErrorResponse(res, "An error occurred while fetching pipelines");
  }
};

const getPipeline = async (req, res) => {
  const { id } = req.params;
  try {
    const pipeline = await Pipeline.findOne({
      where: { id, tenant_id: req.user.tenant_id },
    });

    if (!pipeline) {
      return notFoundResponse(res, "Pipeline not found");
    }

    return successResponse(res, "Pipeline fetched successfully", pipeline);
  } catch (error) {
    console.error(error);
    return serverErrorResponse(
      res,
      "An error occurred while fetching the pipeline"
    );
  }
};

const deletePipeline = async (req, res) => {
  const { id } = req.params;
  try {
    const pipeline = await Pipeline.findOne({
      where: { id, tenant_id: req.user.tenant_id },
    });

    if (!pipeline) {
      return notFoundResponse(res, "Pipeline not found or not authorized");
    }

    await pipeline.destroy();

    return successResponse(res, "Pipeline deleted successfully", null);
  } catch (error) {
    console.error(error);
    return serverErrorResponse(
      res,
      "An error occurred while deleting the pipeline"
    );
  }
};

const updatePipeline = async (req, res) => {
  const { name } = req.body;
  const id = req.params.id;
  try {
    const pipeline = await Pipeline.findOne({
      where: { id, tenant_id: req.user.tenant_id },
    });

    if (!pipeline) {
      return notFoundResponse(res, "Pipeline not found");
    }

    await pipeline.update({
      name: name || pipeline.name,
    });

    return successResponse(res, "Pipeline updated successfully", pipeline);
  } catch (error) {
    return serverErrorResponse(
      res,
      "Internal server error while updating Pipeline"
    );
  }
};

export { createPipeline, getAllPipelines, getPipeline, deletePipeline, updatePipeline };