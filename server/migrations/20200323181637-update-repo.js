'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'repo',
      'user_id',
      {
        type: Sequelize.UUID,
        references: {
          model: 'user', // name of Target model
          key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    );
    await queryInterface.dropTable('tracked_repo');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      'repo',
      'user_id',
    );
    await queryInterface.createTable('tracked_repo', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      repo_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      user_id: {
        allowNull: false,
        type: Sequelize.UUID,
      },
    });
    await queryInterface.addIndex(
      'tracked_repo',
      [ 'repo_id' ],
      { unique: false }
    );
    await queryInterface.addIndex(
      'tracked_repo',
      [ 'user_id' ],
      { unique: false, }
    );
  }
};
