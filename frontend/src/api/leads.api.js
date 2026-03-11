import api from "./api";

export const getLeads = async () => {
    const res = await api.get("/api/leads/");
    console.log("Fetched All Leads Data:", res.data);
    return res.data;
}

export const getLeadsByPipeline = async (pipelineId) => {
    const res = await api.get(`/api/leads/pipeline/${pipelineId}`);
    console.log("Fetched All Pipeline Leads Data:", res.data);
    return res.data;
}

export const getLeadById = async (id) => {
    const res = await api.get(`/api/leads/${id}`);
    console.log("Fetched Lead by Id Data:", res.data);
    return res.data;
}

export const createLead = async (payload) => {
    const res = await api.post("/api/leads/", payload);
    console.log("New Lead Data:", res.data);
    return res.data;
}

export const updateLead = async (id, payload) => {
    const res = await api.put(`/api/leads/${id}`, payload);
    console.log("Updated Lead Data:", res.data);
    return res.data;
}

export const deleteLead = async (id) => {
    const res = await api.delete(`/api/leads/${id}`);
    console.log("Deleted Lead Data:", res.data);
    return res.data;
}