import { Model, where } from "sequelize";
import Tenant from "../models/tenant.model.js";
import { serverErrorResponse, conflictResponse , createdResponse,badRequestResponse ,notFoundResponse} from "../utils/responses.js";
import {User} from "../models/associations.js";

//Creating Tenanr 
const createTenant = async (req, res) => {

    const { name, address, contact_email, phone } = req.body;
    console.log(req.body);

    try {
        
        const existedTenant = await Tenant.findOne({ where: { contact_email } });
        if (existedTenant) {
            return conflictResponse(res, 'A tenant with this email already exists!');
        }

            const newTenant = await Tenant.create({
                name,
                address,
                contact_email,
                phone,
                isActive: true
            });

        return createdResponse(res, 'Tenant created successfully', newTenant);
        
}catch (error) {
        return serverErrorResponse(res, 'An error occurred while creating tenant');

    }
}

const getAllTenants = async (req, res) => {
    try {
        const tenants = await Tenant.findAll();
        return createdResponse(res, 'All Tenants fetched successfully', tenants);
    } catch (error) {
        return serverErrorResponse(res, 'An error occurred while fetching tenants');
    }
}


const getTenant = async (req, res) => {

    const id = req.params.id;
    try {
        const tenant = await Tenant.findByPk(id);
        if (!tenant) {
            return notFoundResponse(res, 'Tenant not found');
        }
        return createdResponse(res, 'Tenant fetched successfully', tenant);

    } catch (error) {
        return serverErrorResponse(res, 'An error occurred while fetching the tenant');
    }
}


const updateTenant = async (req, res) => {

    const {id} = req.params;
    const { name, address, contact_email, phone,isActive } = req.body;
    console.log(req.body)

    try {
        const tenant = await Tenant.findByPk(id);
        if (!tenant) {
            return notFoundResponse(res, 'Tenant not found');
        }

        await tenant.update({
            name: name || tenant.name,
            address: address || tenant.address,
            contact_email: contact_email || tenant.contact_email,
            phone: phone || tenant.phone,
            isActive: isActive ?? tenant.isActive
        })
        
        
        return createdResponse(res, 'Tenant updated successfully', tenant);
        
    }catch (error) {
        return serverErrorResponse(res, 'An error occurred while updating the tenant');
    }
}


const deleteTenant = async (req, res) => {
    const tenantId = req.params.id;

    try {
        const tenant = await Tenant.findByPk(tenantId);
        if (!tenant) {
            return notFoundResponse(res, 'Tenant not found');
        }
        await tenant.destroy();
        return createdResponse(res, 'Tenant deleted successfully');
    } catch (error) {
        return serverErrorResponse(res, 'Internal server Error while deleting tenant');
    }
}

export { createTenant , getAllTenants, getTenant,updateTenant , deleteTenant };