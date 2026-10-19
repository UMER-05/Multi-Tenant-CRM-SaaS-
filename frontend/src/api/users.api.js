import api from './api'

//users api calls
export const fetchUsers = async (id) => {
    const res = await api.get(`/api/users/all/${id}`);
    console.log("Fetched All Users Data:", res.data);
    return res.data;
}

export const getUserById = async (id) => {
    const res = await api.get(`/api/users/${id}`);
    console.log("User by Id Data:", res.data);
    return res.data;
}

export const addUser = async (payload) => {
    const res = await api.post(`/api/auth/signup`, payload);
    console.log("New User Data:", res.data);
    return res.data;
}

export const updateUser = async (id, payload) => {
    const res = await api.put(`/api/users/${id}`, payload);
    console.log("Updated User Data:", res.data);
    return res.data;
}

export const deleteUser = async (id) => {
    const res = await api.delete(`/api/users/${id}`);
    console.log("Deleted User Data:", res.data);
    return res.data;
}