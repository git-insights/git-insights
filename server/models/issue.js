module.exports = (sequelize, DataTypes) => {
  const Issue = sequelize.define(
    'Issue',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      repoId: {
        type: DataTypes.INTEGER,
        field: 'repo_id',
      },
      number: DataTypes.INTEGER,
      title: DataTypes.TEXT,
      // TODO: Make this a FK?
      userGithubId: {
        type: DataTypes.INTEGER,
        field: 'user_github_id',
      },
      userGithubLogin: {
        type: DataTypes.STRING,
        field: 'user_github_login',
      },
      // labels: [],
      state: DataTypes.STRING,
      // assignee: null,
      // assignees: [],
      // milestone: null,
      comments: DataTypes.INTEGER,
      createdAt: {
        type: DataTypes.DATE,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: 'updated_at',
      },
      closedAt: {
        type: DataTypes.DATE,
        field: 'closed_at',
      },
      authorAssociation: {
        type: DataTypes.STRING,
        field: 'author_association',
      },
      body: DataTypes.TEXT,
    },
    {
      tableName: 'issue',
      timestamps: false,
    }
  );

  /**
   * Methods
   */
  Issue.associate = function(_models) {}

  return Issue;
};