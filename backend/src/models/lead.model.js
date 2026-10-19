import { Sequelize } from "sequelize";
import sequelize from "../db/db.js";

const Lead = sequelize.define(
  "Lead",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    contact_info: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    source: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    expected_value: {
      type: Sequelize.DECIMAL(13, 2),
      allowNull: true,
    },

    assigned_user_id: {
      type: Sequelize.UUID,
      allowNull: true,
    },
    tenant_id: {
      type: Sequelize.UUID,
      allowNull: false,
    },
    pipeline_id: {
      type: Sequelize.UUID,
      allowNull: false,
    },

    pipeline_stage_id: {
      type: Sequelize.UUID,
      allowNull: false,
    },
    status: {
      type: Sequelize.ENUM("open", "closed"),
      defaultValue: "open",
    },
    outcome: {
      type: Sequelize.ENUM("win", "lose", "pending"),
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
  }
);

export default Lead;
