'use strict';

/** @type {import('sequelize-cli').Migration} */

  export async function up(queryInterface, Sequelize) {
  await queryInterface.renameColumn('Task', 'user_id', 'created_by');
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.renameColumn('Task', 'created_by', 'user_id');

};
