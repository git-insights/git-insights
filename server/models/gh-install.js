module.exports = (sequelize, DataTypes) => {
  const GithubInstall = sequelize.define(
    'GithubInstall',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      repoId: {
        allowNull: false,
        field: 'repo_id',
        type: DataTypes.INTEGER,
      },

      /**
       * Are we installing on an organization
       * or personal account?
       */
      tagetType: {
        allowNull: false,
        field: 'target_type',
        type: DataTypes.STRING,
      },
      targetId: {
        allowNull: false,
        field: 'target_id',
        type: DataTypes.INTEGER,
      },

      /**
       * Owner of this installation.
       */
      senderGithubId: {
        allowNull: false,
        field: 'sender_github_id',
        type: DataTypes.INTEGER,
      },

    },
    {
      tableName: 'github_install',
      timestamps: false,
      indexes: [
        { unique: false, fields: [ 'repo_id' ] },
      ]
    }
  );
  GithubInstall.associate = function(_models) {}
  return GithubInstall;
};
