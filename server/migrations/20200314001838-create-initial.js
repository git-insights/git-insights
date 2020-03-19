'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cache', {
      query: {
        type: Sequelize.TEXT,
        primaryKey: true,
        allowNull: false,
      },
      data: Sequelize.JSONB,
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    await queryInterface.createTable('commit', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4
      },
      repo_id: Sequelize.INTEGER,
      sha: Sequelize.STRING,
      author_name: Sequelize.STRING,
      author_email: Sequelize.STRING,
      author_date: Sequelize.DATE,
      committer_name: Sequelize.STRING,
      committer_email: Sequelize.STRING,
      committer_date: Sequelize.DATE,
      message: Sequelize.TEXT,
      line_additions: Sequelize.INTEGER,
      line_deletions: Sequelize.INTEGER,
      line_total_changes: Sequelize.INTEGER
    });
    await queryInterface.createTable('gh_install', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4
      },
      repo_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      target_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      target_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      sender_github_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      }
    });
    await queryInterface.addIndex(
      'gh_install',
      [ 'repo_id' ],
      { unique: false }
    );
    await queryInterface.createTable('gh_user', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      login: Sequelize.TEXT,
      node_id: Sequelize.TEXT,
      avatar_url: Sequelize.TEXT,
      gravatar_id: Sequelize.TEXT,
      url: Sequelize.TEXT,
      html_url: Sequelize.TEXT,
      followers_url: Sequelize.TEXT,
      following_url: Sequelize.TEXT,
      gists_url: Sequelize.TEXT,
      starred_url: Sequelize.TEXT,
      subscriptions_url: Sequelize.TEXT,
      organizations_url: Sequelize.TEXT,
      repos_url: Sequelize.TEXT,
      events_url: Sequelize.TEXT,
      received_events_url: Sequelize.TEXT,
      type: Sequelize.TEXT,
      site_admin: Sequelize.BOOLEAN,
      name: Sequelize.TEXT,
      company: Sequelize.TEXT,
      blog: Sequelize.TEXT,
      location: Sequelize.TEXT,
      email: Sequelize.TEXT,
      hireable: Sequelize.BOOLEAN,
      bio: Sequelize.TEXT,
      public_repos: Sequelize.INTEGER,
      public_gists: Sequelize.INTEGER,
      followers: Sequelize.INTEGER,
      following: Sequelize.INTEGER,
      gh_created_at: Sequelize.DATE,
      gh_updated_at: Sequelize.DATE,
      city: Sequelize.TEXT,
      state: Sequelize.TEXT,
      country: Sequelize.TEXT,
      lat: Sequelize.REAL,
      lng: Sequelize.REAL,
      created_at_internal: Sequelize.DATE,
      updated_at_internal: Sequelize.DATE,
      deleted_at_internal: Sequelize.DATE,
    });
    await queryInterface.createTable('issue_event', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      action: Sequelize.STRING,
      issue_id: Sequelize.INTEGER,
      repo_id: Sequelize.INTEGER,
      author_github_id: Sequelize.INTEGER,
      author_github_login: Sequelize.STRING,
      is_bot: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      created_at: Sequelize.DATE
    });
    await queryInterface.createTable('issue', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      repo_id: Sequelize.INTEGER,
      number: Sequelize.INTEGER,
      title: Sequelize.TEXT,
      user_github_id: Sequelize.INTEGER,
      user_github_login: Sequelize.STRING,
      state: Sequelize.STRING,
      comments: Sequelize.INTEGER,
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      closed_at: Sequelize.DATE,
      author_association: Sequelize.STRING,
      body: Sequelize.TEXT,
    });
    await queryInterface.createTable('repo', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      node_id: Sequelize.TEXT,
      name: Sequelize.TEXT,
      full_name: Sequelize.TEXT,
      private: Sequelize.BOOLEAN,
      html_url: Sequelize.TEXT,
      description: Sequelize.TEXT,
      fork: Sequelize.BOOLEAN,
      url: Sequelize.TEXT,
      forks_url: Sequelize.TEXT,
      keys_url: Sequelize.TEXT,
      collaborators_url: Sequelize.TEXT,
      teams_url: Sequelize.TEXT,
      hooks_url: Sequelize.TEXT,
      issue_events_url: Sequelize.TEXT,
      events_url: Sequelize.TEXT,
      assignees_url: Sequelize.TEXT,
      branches_url: Sequelize.TEXT,
      tags_url: Sequelize.TEXT,
      blobs_url: Sequelize.TEXT,
      git_tags_url: Sequelize.TEXT,
      git_refs_url: Sequelize.TEXT,
      trees_url: Sequelize.TEXT,
      statuses_url: Sequelize.TEXT,
      languages_url: Sequelize.TEXT,
      stargazers_url: Sequelize.TEXT,
      contributors_url: Sequelize.TEXT,
      subscribers_url: Sequelize.TEXT,
      subscription_url: Sequelize.TEXT,
      commits_url: Sequelize.TEXT,
      git_commits_url: Sequelize.TEXT,
      comments_url: Sequelize.TEXT,
      issue_comment_url: Sequelize.TEXT,
      contents_url: Sequelize.TEXT,
      compare_url: Sequelize.TEXT,
      merges_url: Sequelize.TEXT,
      archive_url: Sequelize.TEXT,
      downloads_url: Sequelize.TEXT,
      issues_url: Sequelize.TEXT,
      pulls_url: Sequelize.TEXT,
      milestones_url: Sequelize.TEXT,
      notifications_url: Sequelize.TEXT,
      labels_url: Sequelize.TEXT,
      releases_url: Sequelize.TEXT,
      deployments_url: Sequelize.TEXT,
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      pushed_at: Sequelize.DATE,
      git_url: Sequelize.TEXT,
      ssh_url: Sequelize.TEXT,
      clone_url: Sequelize.TEXT,
      svn_url: Sequelize.TEXT,
      homepage: Sequelize.TEXT,
      size: Sequelize.INTEGER,
      stargazers_count: Sequelize.INTEGER,
      watchers_count: Sequelize.INTEGER,
      language: Sequelize.TEXT,
      has_issues: Sequelize.BOOLEAN,
      has_projects: Sequelize.BOOLEAN,
      has_downloads: Sequelize.BOOLEAN,
      has_wiki: Sequelize.BOOLEAN,
      has_pages: Sequelize.BOOLEAN,
      forks_count: Sequelize.INTEGER,
      mirror_url: Sequelize.TEXT,
      archived: Sequelize.BOOLEAN,
      disabled: Sequelize.BOOLEAN,
      open_issues_count: Sequelize.INTEGER,
      forks: Sequelize.INTEGER,
      open_issues: Sequelize.INTEGER,
      watchers: Sequelize.INTEGER,
      default_branch: Sequelize.TEXT,
      network_count: Sequelize.INTEGER,
      subscribers_count: Sequelize.INTEGER,
      tracked: Sequelize.BOOLEAN,
      processed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      created_at_internal: Sequelize.DATE,
      updated_at_internal: Sequelize.DATE,
      deleted_at_internal: Sequelize.DATE
    });
    await queryInterface.createTable('review_event', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      action: Sequelize.STRING,
      review_id: Sequelize.INTEGER,
      repo_id: Sequelize.INTEGER,
      author_github_id: Sequelize.INTEGER,
      author_github_login: Sequelize.STRING,
      author_name: Sequelize.STRING,
      author_email: Sequelize.STRING,
      is_bot: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      created_at: Sequelize.DATE,
    });
    await queryInterface.createTable('review', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      number: Sequelize.INTEGER,
      title: Sequelize.TEXT,
      repo_id: Sequelize.INTEGER,
      user_github_id: Sequelize.INTEGER,
      user_github_login: Sequelize.STRING,
      state: Sequelize.STRING,
      comments: Sequelize.INTEGER,
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      closed_at: Sequelize.DATE,
      author_association: Sequelize.STRING,
      body: Sequelize.TEXT,
    });
    await queryInterface.createTable('session', {
      sid: {
        type: Sequelize.STRING(36),
        primaryKey: true
      },
      expires: Sequelize.DATE,
      data: Sequelize.TEXT
    });
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
    await queryInterface.createTable('user', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      gh_token: Sequelize.STRING,
      gh_app_id: Sequelize.INTEGER,
      gh_app_login: Sequelize.STRING,
      gh_app_login_type: Sequelize.STRING,
      gh_id: Sequelize.INTEGER,
      gh_login: Sequelize.STRING,
      email: Sequelize.STRING,
      first_name: Sequelize.STRING,
      last_name: Sequelize.STRING,
      picture: Sequelize.STRING,
      location: Sequelize.STRING,
      website: Sequelize.STRING,
      tracking_repo: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      primary_repo: Sequelize.INTEGER,
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      deleted_at: Sequelize.DATE,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('cache');
    await queryInterface.dropTable('commit');
    await queryInterface.dropTable('gh_install');
    await queryInterface.dropTable('gh_user');
    await queryInterface.dropTable('issue_event');
    await queryInterface.dropTable('issue');
    await queryInterface.dropTable('repo');
    await queryInterface.dropTable('review_event');
    await queryInterface.dropTable('review');
    await queryInterface.dropTable('session');
    await queryInterface.dropTable('tracked_repo');
    await queryInterface.dropTable('user');
  }
};
