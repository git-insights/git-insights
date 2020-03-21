module.exports = (sequelize, DataTypes) => {
  /**
   *
   * Valid actions are:
   *    "opened", "closed", "edited", "deleted", "pinned",
   *    "unpinned", "closed", "reopened", "assigned", "unassigned",
   *    "labeled", "unlabeled", "locked", "unlocked", "transferred",
   *    "comment-created", "comment-edited", "comment-deleted"
   *
   * TODO: This model currently lacks event details
   *
   */
  const IssueEvent = sequelize.define(
    'IssueEvent',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      action: DataTypes.STRING,
      // Reference to the issue
      issueId: {
        type: DataTypes.INTEGER,
        field: 'issue_id',
      },
      repoId: {
        type: DataTypes.INTEGER,
        field: 'repo_id',
      },
      // Reference to the sender
      authorGithubId: {
        type: DataTypes.INTEGER,
        field: 'author_github_id',
      },
      authorGithubLogin: {
        type: DataTypes.STRING,
        field: 'author_github_login',
      },
      isBot: {
        type: DataTypes.BOOLEAN,
        field: 'is_bot',
        defaultValue: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        field: 'created_at',
      }
    },
    {
      tableName: 'issue_event',
      timestamps: false,
    }
  );

  /**
   * Methods
   */
  IssueEvent.associate = function(_models) {}

  return IssueEvent;
};