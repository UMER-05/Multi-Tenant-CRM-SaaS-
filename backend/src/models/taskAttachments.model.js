//without migration
import { DataTypes } from "sequelize";
import sequelize from "../db/db.js";
const TaskNoteAttachment = sequelize.define(
  "TaskNoteAttachment",
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
    task_id:{
        type: DataTypes.UUID,
        allowNull: false,
    },

    uploaded_by: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    file_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    file_url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    public_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    file_type: {
      type: DataTypes.STRING,
    },

    file_size: {
      type: DataTypes.INTEGER,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);
export default TaskNoteAttachment;
