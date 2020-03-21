module.exports = (sequelize, DataTypes) => {
  /**
   *
   * Current list of actions:
   *  added_to_project: The issue was added to a project board.You only see this event in responses when project boards have been enabled in the repository.
   *  assigned: The issue was assigned to the assignee.
   *  closed: The issue was closed by the actor. When the commit_id is present, it identifies the commit that closed the issue using "closes / fixes #NN" syntax.
   *  commented: A comment was added to the issue.
   *  committed: A commit was added to the pull request's HEAD branch. Only provided for pull requests.
   *  converted_note_to_issue: The issue was created by converting a note in a project board to an issue. You only see this event in responses when project boards have been enabled in the repository.
   *  cross: referenced	The issue was referenced from another issue. The source attribute contains the id, actor, and url of the reference's source.
   *  demilestoned: The issue was removed from a milestone.
   *  head_ref_deleted: The pull request's branch was deleted.
   *  head_ref_restored: The pull request's branch was restored.
   *  labeled: A label was added to the issue.
   *  locked: The issue was locked by the actor.
   *  marked_as_duplicate: A user with write permissions marked an issue as a duplicate of another issue or a pull request as a duplicate of another pull request.
   *  mentioned: The actor was @mentioned in an issue body.
   *  merged: The issue was merged by the actor. The commit_id attribute is the SHA1 of the HEAD commit that was merged.
   *  milestoned: The issue was added to a milestone.
   *  moved_columns_in_project: The issue was moved between columns in a project board. You only see this event in responses when project boards have been enabled in the repository.
   *  referenced: The issue was referenced from a commit message. The commit_id attribute is the commit SHA1 of where that happened.
   *  removed_from_project: The issue was removed from a project board. You only see this event in responses when project boards have been enabled in the repository.
   *  renamed: The issue title was changed.
   *  reopened: The issue was reopened by the actor.
   *  review_dismissed: The actor dismissed a review from the pull request.
   *  review_requested: The actor requested a review from the subject on this pull request.
   *  review_request_removed: The actor removed the review request for the subject on this pull request.
   *  subscribed: The actor subscribed to receive notifications for an issue.
   *  unassigned: The assignee was unassigned from the issue.
   *  unlabeled: A label was removed from the issue.
   *  unlocked: The issue was unlocked by the actor.
   *  unmarked_as_duplicate: An issue that a user had previously marked as a duplicate of another issue is no longer considered a duplicate, or a pull request that a user had previously marked as a duplicate of another pull request is no longer considered a duplicate.
   *  unsubscribed: The actor unsubscribed to stop receiving notifications for an issue.
   *  user_blocked: An organization owner blocked a user from the organization. This was done through one of the blocked user's comments on the issue.
   *
   *  if reviewed, will return one of the following states:
   *  commented, approved, or changes_requested
   *  we'll save these events as review-commented, review-approved, review-changes_requested
   * TODO: This model currently lacks event details
   * TODO: More actions exist with webhooks
   *
   */
  const ReviewEvent = sequelize.define(
    'ReviewEvent',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      action: DataTypes.STRING,
      // Reference to the review
      reviewId: {
        type: DataTypes.INTEGER,
        field: 'review_id',
      },
      repoId: {
        type: DataTypes.INTEGER,
        field: 'repo_id',
      },
      /*
        In case of a commit there's only name & email
        available to identify the contributor. We'll
        store as much info as possible and resolve
        identities for each project separately
      */
      authorGithubId: {
        type: DataTypes.INTEGER,
        field: 'author_github_id'
      },
      authorGithubLogin: {
        type: DataTypes.STRING,
        field: 'author_github_login'
      },
      authorName: {
        type: DataTypes.STRING,
        field: 'author_name',
      },
      authorEmail: {
        type: DataTypes.STRING,
        field: 'author_email',
      },
      isBot: {
        type: DataTypes.BOOLEAN,
        field: 'is_bot',
        defaultValue: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        field: 'created_at'
      }
    },
    {
      tableName: 'review_event',
      timestamps: false,
    }
  );

  /**
   * Methods
   */
  ReviewEvent.associate = function(_models) {}

  return ReviewEvent;
};