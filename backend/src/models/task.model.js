import { DataTypes } from "sequelize";
import { ENUM } from "sequelize";
import sequelize from "../db/db.js";
import User from "./user.model.js";

const Task = sequelize.define(
  "Task",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    taskName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "User",
        key: "id",
      },
    },
    tenant_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    updated_by: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "User",
        key: "id",
      },
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("completed", "pending", "in_progress"),
      defaultValue: "pending",
    },
    //without migration
    priority: {
      type: DataTypes.ENUM("Urgent", "High", "Medium", "Low"),
      defaultValue: "Medium",
    },

    assigned_user: {
      type: DataTypes.UUID,
      references: {
        model: "User",
        key: "id",
      },
      allowNull: true,
    },
    assigned_lead: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    due_date: {
      type: DataTypes.DATE,
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
  }
);

export default Task;
