//without migration
import {  DataTypes } from "sequelize";
import sequelize from "../db/db.js";

const TaskNote = sequelize.define(
  "TaskNote",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    tenant_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    task_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    created_by: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);
export default TaskNote;
