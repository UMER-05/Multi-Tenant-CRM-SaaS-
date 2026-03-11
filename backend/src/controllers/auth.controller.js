import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Tenant from "../models/tenant.model.js";
import {
  createdResponse,
  serverErrorResponse,
  conflictResponse,
  notFoundResponse,
  unauthorizedResponse,
  successResponse,
} from "../utils/responses.js";
import { UserRole } from "../constants.js";

const Signup = async (req, res) => {
  const { full_name, email, password, tenant_id, role } = req.body;
  console.log(req.body);

  let tenantId = req.user.tenant_id;
  if (req.user.role == UserRole.SUPERADMIN && tenant_id) {
    tenantId = tenant_id;
  }

  if (req.user.role !== UserRole.SUPERADMIN && role >= UserRole.SUPERADMIN) {
    return unauthorizedResponse(
      res,
      "Insufficient permissions to assign SUPERADMIN role"
    );
  }

  if (req.user.role == UserRole.ADMIN && role !== UserRole.USER) {
    return unauthorizedResponse(
      res,
      "Insufficient permissions to assign this role"
    );
  }

  try {
    const existedUser = await User.findOne({
      where: { email, tenant_id: tenantId },
    });

    if (existedUser) {
      return conflictResponse(res, "A user already exists with this email !");
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      full_name,
      email,
      password: hashedPassword,
      role: role || 1,
      tenant_id: tenantId,
    });

    return createdResponse(res, "User registered successfully", newUser);
  } catch (error) {
    return serverErrorResponse(res, "Internal server Error");
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return notFoundResponse(res, "User not found");
    }
    const tenant = await Tenant.findByPk(user.tenant_id);
    if (!tenant) {
      return unauthorizedResponse(res, "Tenant not found !");
    }
    if (!tenant.isActive) {
      return unauthorizedResponse(res, "Tenant is inactive !");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return unauthorizedResponse(res, "Invalid password");
    }
    const token = jwt.sign(
      { id: user.id, role: user.role, tenant_id: user.tenant_id },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    return successResponse(res, "Login successful", { token });
  } catch (error) {
    return serverErrorResponse(res, "An error occurred while logging in");
  }
};

const googleLoginSuccess = (req, res) => {
  const token = jwt.sign(
    { id: req.user.id, role: req.user.role, tenant_id: req.user.tenant_id },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
  res.redirect(
    `${process.env.frontendURL}/oauth-success?token=${token}`
  );
   // return successResponse(res, "Login successful", { token });
};

export { Signup, login,googleLoginSuccess };
