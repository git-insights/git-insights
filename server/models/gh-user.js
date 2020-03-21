module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'GithubUser',
    {
      // Github Values
      login: DataTypes.TEXT,
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      node_id: DataTypes.TEXT,
      avatar_url: DataTypes.TEXT,
      gravatar_id: DataTypes.TEXT,
      url: DataTypes.TEXT,
      html_url: DataTypes.TEXT,
      followers_url: DataTypes.TEXT,
      following_url: DataTypes.TEXT,
      gists_url: DataTypes.TEXT,
      starred_url: DataTypes.TEXT,
      subscriptions_url: DataTypes.TEXT,
      organizations_url: DataTypes.TEXT,
      repos_url: DataTypes.TEXT,
      events_url: DataTypes.TEXT,
      received_events_url: DataTypes.TEXT,
      type: DataTypes.TEXT,
      site_admin: DataTypes.BOOLEAN,
      name: DataTypes.TEXT,
      company: DataTypes.TEXT,
      blog: DataTypes.TEXT,
      location: DataTypes.TEXT,
      email: DataTypes.TEXT,
      hireable: DataTypes.BOOLEAN,
      bio: DataTypes.TEXT,
      public_repos: DataTypes.INTEGER,
      public_gists: DataTypes.INTEGER,
      followers: DataTypes.INTEGER,
      following: DataTypes.INTEGER,
      gh_created_at: DataTypes.DATE,
      gh_updated_at: DataTypes.DATE,

      city: DataTypes.TEXT,
      state: DataTypes.TEXT,
      country: DataTypes.TEXT,

      lat: DataTypes.REAL,
      lng: DataTypes.REAL,
    },
    {
      tableName: 'gh_user',
      createdAt: 'created_at_internal',
      updatedAt: 'updated_at_internal',
      deletedAt: 'deleted_at_internal',
      paranoid: true,
      timestamps: true,
    }
  );

  User.associate = function(_models) {
    // associations can be defined here
  };
  return User;
};