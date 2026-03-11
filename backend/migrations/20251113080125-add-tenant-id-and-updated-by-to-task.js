'use strict';

/** @type {import('sequelize-cli').Migration} */
  export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('Task', 'tenant_id', {
    type: Sequelize.STRING,
    allowNull: false,
  });

  await queryInterface.addColumn('Task', 'updated_by', {
    type: Sequelize.STRING,
    allowNull: false,
  });

  await queryInterface.addIndex('Task', ['tenant_id']);
  await queryInterface.addIndex('Task', ['updated_by']);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeIndex('Task', ['tenant_id']);
  await queryInterface.removeIndex('Task', ['updated_by']);
  await queryInterface.removeColumn('Task', 'tenant_id');
  await queryInterface.removeColumn('Task', 'updated_by');
}
