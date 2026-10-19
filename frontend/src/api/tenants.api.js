import api from "./api";

export const getTenants = async () => {
    const res = await api.get("/api/tenants/");
    console.log("Fetched All Tenants Data:", res.data);
    return res.data;
}

export const getTenantById = async (id) => {
    const res = await api.get(`/api/tenants/${id}`);
    console.log("Fetched Tenant by Id Data:", res.data);
    return res.data;
}

export const createTenants = async (payload) => {
    const res = await api.post("/api/tenants/", payload);
    console.log("New Tenants Data:", res.data);
    return res.data;
}

export const updateTenant = async (id, payload) => {
    const res = await api.put(`/api/tenants/${id}`, payload);
    console.log("Updated Tenant Data:", res.data);
    return res.data;
}

export const deleteTenant = async (id) => {
    const res = await api.delete(`/api/tenants/${id}`);
    console.log("Deleted Tenant Data:", res.data);
    return res.data;
}
