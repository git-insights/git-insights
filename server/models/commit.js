module.exports = (sequelize, DataTypes) => {
  const Commit = sequelize.define(
    'Commit',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      repoId: {
        type: DataTypes.INTEGER,
        field: 'repo_id',
      },
      sha: DataTypes.STRING,
      authorName: {
        type: DataTypes.STRING,
        field: 'author_name',
      },
      authorEmail: {
        type: DataTypes.STRING,
        field: 'author_email',
      },
      authorDate: {
        type: DataTypes.DATE,
        field: 'author_date',
      },
      committerName: {
        type: DataTypes.STRING,
        field: 'committer_name',
      },
      committerEmail: {
        type: DataTypes.STRING,
        field: 'committer_email',
      },
      committerDate: {
        type: DataTypes.DATE,
        field: 'committer_date',
      },
      message: DataTypes.TEXT,
      lineAdditions: {
        type: DataTypes.INTEGER,
        field: 'line_additions',
      },
      lineDeletions: {
        type: DataTypes.INTEGER,
        field: 'line_deletions',
      },
      lineTotalChanges: {
        type: DataTypes.INTEGER,
        field: 'line_total_changes',
      },
    },
    {
      tableName: 'commit',
      timestamps: false,
    }
  );

  /**
   * Methods
   */
  Commit.associate = function(_models) {}

  return Commit;
};