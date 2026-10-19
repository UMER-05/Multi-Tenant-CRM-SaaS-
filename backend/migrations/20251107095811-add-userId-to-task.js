'use strict';

/** @type {import('sequelize-cli').Migration} */
 export async function up (queryInterface, Sequelize) {

    await queryInterface.addColumn('Task', 'user_id', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id',
      },
      onDelete: 'CASCADE',
    });

  }

 export async function down (queryInterface, Sequelize) {

    await queryInterface.removeColumn('Task', 'user_id');

}
