module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define(
    'Review',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      number: DataTypes.INTEGER,
      title: DataTypes.TEXT,
      repoId: {
        type: DataTypes.INTEGER,
        field: 'repo_id',
      },
      // TODO: Make this a FK?
      userGithubId: {
        type: DataTypes.INTEGER,
        field: 'user_github_id',
      },
      userGithubLogin: {
        type: DataTypes.STRING,
        field: 'user_github_login'
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
      tableName: 'review',
      timestamps: false,
    }
  );

  /**
   * Methods
   */
  Review.associate = function(_models) {}

  return Review;
};