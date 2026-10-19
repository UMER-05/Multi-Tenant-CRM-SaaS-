import { Sequelize, DataTypes } from "sequelize";
import sequelize  from "../db/db.js";


const Tenant = sequelize.define("Tenant", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    contact_email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    phone:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    isActive: {
  type: Sequelize.BOOLEAN,
  defaultValue: true
}
    
},
{
    timestamps: true,
    freezeTableName: true,
})
export default Tenant;