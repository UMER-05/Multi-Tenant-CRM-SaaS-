import Lead from "../models/lead.model.js";
import Pipeline from "../models/pipeline.model.js";
import Stage from "../models/stage.model.js";
import { User } from "../models/associations.js";
import {
  createdResponse,
  serverErrorResponse,
  notFoundResponse,
  successResponse,
} from "../utils/responses.js";

const createLead = async (req, res) => {
  const {
    name,
    contact_info,
    source,
    expected_value,
    assigned_user_id,
    pipeline_id,
    pipeline_stage_id,
    status,
    outcome,
  } = req.body;
  try {
    // Check if pipeline exists and belongs to tenant
    const pipeline = await Pipeline.findOne({
      where: { id: pipeline_id, tenant_id: req.user.tenant_id },
    });
    if (!pipeline) {
      return notFoundResponse(res, "Pipeline not found or not authorized");
    }

    // Check if stage exists and belongs to tenant
    const stage = await Stage.findOne({
      where: { id: pipeline_stage_id, tenant_id: req.user.tenant_id },
    });
    if (!stage) {
      return notFoundResponse(res, "Stage not found or not authorized");
    }

    // If assigned_user_id, check if user exists in tenant
    if (assigned_user_id) {
      const user = await User.findOne({
        where: { id: assigned_user_id, tenant_id: req.user.tenant_id },
      });
      if (!user) {
        return notFoundResponse(res, "Assigned user not found or not authorized");
      }
    }

    const newLead = await Lead.create({
      name,
      contact_info,
      source,
      expected_value,
      assigned_user_id,
      tenant_id: req.user.tenant_id,
      pipeline_id,
      pipeline_stage_id,
      status,
      outcome,
    });
    return createdResponse(res, "Lead created successfully", newLead);
  } catch (error) {
    return serverErrorResponse(
      res,
      "An error occurred while creating the lead"
    );
  }
};

const getAllLeads = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const offset = (page - 1) * limit;

    const { count, rows: leads } = await Lead.findAndCountAll({
      where: { tenant_id: req.user.tenant_id },
      include: [
        { model: Pipeline, attributes: ["id", "name"] },
        { model: Stage, attributes: ["id", "name"] },
        { model: User, as: "assignedUser", attributes: ["id", "full_name"] },
      ],
      offset,
      limit,
    });
    
    const totalPages = Math.ceil(count / limit);

    return successResponse(res, "Leads fetched successfully", {
      totalItems: count,
      totalPages,
      currentPage: page,
      pageSize: limit,
      leads,
    });
  } catch (error) {
    console.error(error);
    return serverErrorResponse(res, "An error occurred while fetching leads");
  }
};

const getAllLeadsByPipelineId = async (req, res) => {
      const id = req.params.id;
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const offset = (page - 1) * limit;

    const { count, rows: leads } = await Lead.findAndCountAll({
      where: {pipeline_id: id, tenant_id: req.user.tenant_id },
      include: [
        { model: Pipeline, attributes: ["id", "name"] },
        { model: Stage, attributes: ["id", "name"] },
        { model: User, as: "assignedUser", attributes: ["id", "full_name"] },
      ],
      offset,
      limit,
    });
    
    const totalPages = Math.ceil(count / limit);

    return successResponse(res, "Leads fetched successfully", {
      totalItems: count,
      totalPages,
      currentPage: page,
      pageSize: limit,
      leads,
    });
  } catch (error) {
    console.error(error);
    return serverErrorResponse(res, "An error occurred while fetching leads");
  }
};

const getLead = async (req, res) => {
  const { id } = req.params;
  try {
    const lead = await Lead.findOne({
      where: { id, tenant_id: req.user.tenant_id },
      include: [
        { model: Pipeline, attributes: ["id", "name"] },
        { model: Stage, attributes: ["id", "name"] },
        { model: User, as: "assignedUser", attributes: ["id", "full_name"] },
      ],
    });

    if (!lead) {
      return notFoundResponse(res, "Lead not found");
    }

    return successResponse(res, "Lead fetched successfully", lead);
  } catch (error) {
    console.error(error);
    return serverErrorResponse(
      res,
      "An error occurred while fetching the lead"
    );
  }
};

const deleteLead = async (req, res) => {
  const { id } = req.params;
  try {
    const lead = await Lead.findOne({
      where: { id, tenant_id: req.user.tenant_id },
    });

    if (!lead) {
      return notFoundResponse(res, "Lead not found or not authorized");
    }

    await lead.destroy();

    return successResponse(res, "Lead deleted successfully", null);
  } catch (error) {
    console.error(error);
    return serverErrorResponse(
      res,
      "An error occurred while deleting the lead"
    );
  }
};

const updateLead = async (req, res) => {
  const {
    name,
    contact_info,
    source,
    expected_value,
    assigned_user_id,
    pipeline_id,
    pipeline_stage_id,
    status,
    outcome,
  } = req.body;
  const id = req.params.id;
  try {
    const lead = await Lead.findOne({
      where: { id, tenant_id: req.user.tenant_id },
    });

    if (!lead) {
      return notFoundResponse(res, "Lead not found");
    }

    // Checks for pipeline, stage, user if provided
    if (pipeline_id) {
      const pipeline = await Pipeline.findOne({
        where: { id: pipeline_id, tenant_id: req.user.tenant_id },
      });
      if (!pipeline) {
        return notFoundResponse(res, "Pipeline not found or not authorized");
      }
    }

    if (pipeline_stage_id) {
      const stage = await Stage.findOne({
        where: { id: pipeline_stage_id, tenant_id: req.user.tenant_id },
      });
      if (!stage) {
        return notFoundResponse(res, "Stage not found or not authorized");
      }
    }

    if (assigned_user_id) {
      const user = await User.findOne({
        where: { id: assigned_user_id, tenant_id: req.user.tenant_id },
      });
      if (!user) {
        return notFoundResponse(res, "Assigned user not found or not authorized");
      }
    }

    await lead.update({
      name: name || lead.name,
      contact_info: contact_info || lead.contact_info,
      source: source || lead.source,
      expected_value: expected_value !== undefined ? expected_value : lead.expected_value,
      assigned_user_id: assigned_user_id || lead.assigned_user_id,
      pipeline_id: pipeline_id || lead.pipeline_id,
      pipeline_stage_id: pipeline_stage_id || lead.pipeline_stage_id,
      status: status || lead.status,
      outcome: outcome || lead.outcome,
    });

    return successResponse(res, "Lead updated successfully", lead);
  } catch (error) {
    return serverErrorResponse(
      res,
      "Internal server error while updating Lead"
    );
  }
};

export { createLead, getAllLeads, getLead, deleteLead, updateLead ,getAllLeadsByPipelineId};