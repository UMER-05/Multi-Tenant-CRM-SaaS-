import api from "./api";

export const getStages = async (id) => {
    const res = await api.get(`/api/stages/${id}`);
    console.log("Fetched All Stages Data:", res.data);
    return res.data;
}

export const getStageById = async (id) => {
    const res = await api.get(`/api/stages/${id}`);
    console.log("Fetched Stage by Id Data:", res.data);
    return res.data;
}

export const createStage = async (payload) => {
    const res = await api.post("/api/stages/", payload);
    console.log("New Stage Data:", res.data);
    return res.data;
}

export const updateStage = async (id, payload) => {
    const res = await api.put(`/api/stages/${id}`, payload);
    console.log("Updated Stage Data:", res.data);
    return res.data;
}

export const deleteStage = async (id) => {
    const res = await api.delete(`/api/stages/${id}`);
    console.log("Deleted Stage Data:", res.data);
    return res.data;
}