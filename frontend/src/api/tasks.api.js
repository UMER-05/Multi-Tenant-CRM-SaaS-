import api from "./api";
export const deleteTask = async (id) => {
    const res = await api.delete(`/api/tasks/${id}`);
    console.log("Deleted Task Data:", res.data);
    return res.data;
}

export const updateTask = async (id, payload) => {
    const res = await api.put(`/api/tasks/${id}`, payload);
    console.log("Updated Task Data:", res.data);
    return res.data;
}

export const getTasks = async (params) =>{
    const res = await api.get('/api/tasks',params);
    console.log("Fetched All Tasks Data:", res.data);
    return res.data;
};

export const getTaskById = async (id) => {
    const res = await api.get(`/api/tasks/${id}`);
    console.log("Task by Id Data:", res.data);
    return res.data;
}

export const createTasks = async (values) =>{
    const res = await api.post('/api/tasks',values);
    console.log("Created Task Data:", res.data);
    return res.data;
};