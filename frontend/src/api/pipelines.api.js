import api from "./api";

export const getPipelines = async () => {
    const res = await api.get("/api/pipelines/");
    console.log("Fetched All Pipelines Data:", res.data);
    return res.data;
}

export const getPipelineById = async (id) => {
    const res = await api.get(`/api/pipelines/${id}`);
    console.log("Fetched Pipeline by Id Data:", res.data);
    return res.data;
}

export const createPipeline = async (payload) => {
    const res = await api.post("/api/pipelines/", payload);
    console.log("New Pipeline Data:", res.data);
    return res.data;
}

export const updatePipeline = async (id, payload) => {
    const res = await api.put(`/api/pipelines/${id}`, payload);
    console.log("Updated Pipeline Data:", res.data);
    return res.data;
}

export const deletePipeline = async (id) => {
    const res = await api.delete(`/api/pipelines/${id}`);
    console.log("Deleted Pipeline Data:", res.data);
    return res.data;
}