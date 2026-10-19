'use strict';

export default {
  up: async (queryInterface, Sequelize) => {
    // 1️⃣ Remove the old column if it exists
    await queryInterface.removeColumn('Task', 'updated_by');

    // 2️⃣ Add updated_by column as UUID
    await queryInterface.addColumn('Task', 'updated_by', {
      type: Sequelize.UUID,
      allowNull: false,
    });

    // 3️⃣ Add foreign key constraint linking to User.id
    await queryInterface.addConstraint('Task', {
      fields: ['updated_by'],
      type: 'foreign key',
      name: 'fk_task_updated_by',
      references: {
        table: 'User',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the foreign key constraint
    await queryInterface.removeConstraint('Task', 'fk_task_updated_by');

    // Remove the column
    await queryInterface.removeColumn('Task', 'updated_by');
  }
};
