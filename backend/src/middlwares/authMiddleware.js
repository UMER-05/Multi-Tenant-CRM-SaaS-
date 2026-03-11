import jwt from 'jsonwebtoken';
import { unauthorizedResponse } from '../utils/responses.js';
import {UserRole} from '../constants.js';
import Tenant from '../models/tenant.model.js';

export const authMiddleware = (requiredRole ) => {

    return async (req, res, next) => {
        
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return unauthorizedResponse(res, 'No token provided');
        }

        const tokenParts = authHeader.split(' ');
        
        if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
            return unauthorizedResponse(res, 'Invalid token format');
        }

        const token = tokenParts[1];
        try {

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            if (requiredRole && decoded.role < requiredRole || decoded.role > UserRole.SUPERADMIN) {
                return unauthorizedResponse(res, 'Insufficient permissions to access this resource');
            }

            const tenant = await Tenant.findByPk(decoded.tenant_id);
            if (!tenant) {
                return unauthorizedResponse(res, 'Tenant not found');
            }
            if (!tenant.isActive) {
                return unauthorizedResponse(res, 'Tenant is inactive');
            }

            req.user = decoded;
            next();

        } catch (error) {
            return unauthorizedResponse(res, 'Invalid or expired token or error during verification of token');
        }


    }}