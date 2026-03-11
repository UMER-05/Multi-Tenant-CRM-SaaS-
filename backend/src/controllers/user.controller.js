import {
  createdResponse,
  serverErrorResponse,
  conflictResponse,
  notFoundResponse,
  unauthorizedResponse,
  successResponse,
  badRequestResponse,
} from "../utils/responses.js";
import User from "../models/user.model.js";
import { UserRole } from "../constants.js";
import bcrypt from 'bcrypt';
import { Tenant } from "../models/associations.js";

const getAllUsers = async (req, res) => {
  const { id: tenantIDReq } = req.params;
  console.log("req", req.params.id);
  try {
    let tenantID = req.user.tenant_id;

    if (req.user.role == UserRole.SUPERADMIN) {
      tenantID = tenantIDReq;
    }
    const users = await User.findAll({ where: { tenant_id: tenantID }, attributes: { exclude: ["password"]} });

    if (!users || users.length === 0) {
      return notFoundResponse(res, "No users found for this tenant");
    }
    return successResponse(res, "All Users fetched successfully", users);
  } catch (error) {
    return serverErrorResponse(
      res,
      "Internal server error while fetching users"
    );
  }
};

const getUser = async (req, res) => {
  const userId = req.params.id;

  try {
    let user;
    if (req.user.role === UserRole.SUPERADMIN) {
      user = await User.findByPk(userId, {
        attributes: { exclude: ["password"] }
      });
    } else {
      user = await User.findOne({
        where: {
          id: userId,
          tenant_id: req.user.tenant_id,
        },
        attributes: { exclude: ["password"] },
      });
    }

    if (!user) {
      return notFoundResponse(res, "User not found");
    }
    return successResponse(res, "User fetched successfully", user);
  } catch (error) {
    return serverErrorResponse(
      res,
      "Internal server error while fetching user"
    );
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { role, full_name, email, password } = req.body;
    console.log("data:", req.body, userId);

    let user;

    if (req.user.role !== UserRole.SUPERADMIN && role >= UserRole.ADMIN) {
      return badRequestResponse(res, "Admin cannot provide this role");
    }
    if (req.user.role === UserRole.SUPERADMIN) {
      user = await User.findByPk(userId);
    }

    if (req.user.role === UserRole.ADMIN) {
      user = await User.findOne({
        where: { id: userId, tenant_id: req.user.tenant_id },
      });
    }
    if (!user) {
      return notFoundResponse(res, "User not found");
    }

    const updateData = {
      full_name: full_name || user.full_name,
      email: email || user.email,
      role: role || user.role,
    };

    if (typeof password === "string" && password.trim().length >= 6) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    await user.update(updateData);

    return successResponse(res, "User updated successfully", user);
  } catch (error) {
    return serverErrorResponse(
      res,
      "Internal server error while updating user"
    );
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    let user;

    if (req.user.role === UserRole.SUPERADMIN) {
      user = await User.findByPk(userId);
    }

    if (req.user.role === UserRole.ADMIN) {
      user = await User.findOne({
        where: {
          id: userId,
          tenant_id: req.user.tenant_id,
        },
      });
    }

    if (!user) {
      return notFoundResponse(res, "User not found");
    }

    await user.destroy();
    return successResponse(res, "User deleted successfully");
  } catch (error) {
    return serverErrorResponse(
      res,
      "Internal server error while deleting user"
    );
  }
};

const getMe = async (req, res) => {
  console.log("Server time now:", new Date());
  const userId = req.user.id;
  const tenantId = req.user.tenant_id;

  try {
    const user = await User.findOne({
      where: { id: userId, tenant_id: tenantId },
      attributes: { exclude: ["password"] },
      include: [{ model: Tenant, attributes: ["name"] }],
    });

    return successResponse(res, "Me fetched successfully", user);
  } catch (error) {
    return serverErrorResponse(res, "Internal server error while getting me");
  }
};

export { getAllUsers, getUser, updateUser, deleteUser, getMe };
