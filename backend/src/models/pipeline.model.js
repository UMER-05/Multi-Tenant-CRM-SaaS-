import { Sequelize } from "sequelize";
import sequelize from "../db/db.js";
//import Tenant from "./tenant.model.js";

const Pipeline = sequelize.define(
  "Pipeline",
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

    tenant_id: {
      type: Sequelize.UUID,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
  }
);

export default Pipeline;
