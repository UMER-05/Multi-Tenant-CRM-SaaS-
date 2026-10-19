import { Sequelize, DataTypes } from "sequelize";
import  sequelize from "../db/db.js";

const User = sequelize.define("User", {

    id: {
        type:DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
     
    role: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
    },
    tenant_id:{
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Tenant',
            key: 'id',
        },
    },
    full_name:{
        type: DataTypes.STRING,
        allowNull: false,

    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false,
    },

},{
    timestamps: true,
    freezeTableName: true,
})
 
export default User;