module.exports = (sequelize, DataTypes) => {
  const TrackedRepo = sequelize.define(
    'TrackedRepo',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      repoId: {
        allowNull: false,
        field: 'repo_id',
        type: DataTypes.INTEGER,
        references: {
          model: 'repo',
          key: 'id'
        }
      },
      userId: {
        allowNull: false,
        field: 'user_id',
        type: DataTypes.UUID,
        references: {
          model: 'user',
          key: 'id'
        }
      },
    },
    {
      tableName: 'tracked_repo',
      timestamps: false,
      indexes: [
        { unique: false, fields: [ 'repo_id' ] },
        { unique: false, fields: [ 'user_id' ] },
      ]
    }
  );
  TrackedRepo.associate = function(models) {
    TrackedRepo.belongsTo(models.Repo, {
      foreignKey: 'repo_id',
      targetKey: 'id',
      as: {
        singular: 'repo',
        plural: 'repos'
      }
    });
    TrackedRepo.belongsTo(models.User, { foreignKey: 'user_id', targetKey: 'id', as: 'User' });
  }
  return TrackedRepo;
};
