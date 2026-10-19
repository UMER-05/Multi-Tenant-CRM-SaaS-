import { Sequelize } from "sequelize";
import sequelize from "../db/db.js";
import Pipeline from "./pipeline.model.js";

const Stage = sequelize.define(
  "Stage",
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
    pipeline_id: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: Pipeline,
        key: "id",        
      },
       onDelete: "CASCADE",
        onUpdate: "CASCADE",
    },
    tenant_id:{
        type: Sequelize.UUID,
      allowNull: false,
    },
     order: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
  }
);

export default Stage;
