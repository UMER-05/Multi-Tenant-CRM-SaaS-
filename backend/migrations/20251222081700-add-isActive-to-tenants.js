'use strict';


export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Tenant", "isActive", {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      allowNull: false
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("Tenant", "isActive");
  }
};
