'use strict';
const crypto = require('crypto');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      /*
        tokens: {
          type: DataTypes.STRING,
          defaultValue: "[]",
          get: function() {
            return JSON.parse(this.getDataValue('tokens'));
          },
          set: function(val) {
            return this.setDataValue('tokens', JSON.stringify(val));
          }
        },

        This doesn't work well for situations like this:
          const user = User.build({ ...profile });
          user.tokens.push({ kind: 'github', accessToken });
        the getter will return an actual array and pushing to array
        won't be saved in db.
      */
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },

      /**
       * Service: Github
       */
      githubToken: {
        type: DataTypes.STRING,
        field: 'gh_token'
      },
      githubAppId: {
        type: DataTypes.INTEGER,
        field: 'gh_app_id'
      },
      githubAppLogin: {
        type: DataTypes.STRING,
        field: 'gh_app_login'
      },
      githubAppLoginType: {
        type: DataTypes.STRING,
        field: 'gh_app_login_type'
      },

      /**
       * Not sure if we need %100
       */
      githubId: {
        type: DataTypes.INTEGER,
        field: 'gh_id'
      },
      githubLogin: {
        type: DataTypes.STRING,
        field: 'gh_login'
      },

      // User Details
      email: {
        type: DataTypes.STRING
      },
      firstName: {
        type: DataTypes.STRING,
        field: 'first_name'
      },
      lastName: {
        type: DataTypes.STRING,
        field: 'last_name'
      },
      picture: DataTypes.STRING,

      // Not so important
      location: DataTypes.STRING,
      website: DataTypes.STRING,

      // Part of onboarding
      trackingRepo: {
        field: 'tracking_repo',
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      primaryRepo: {
        field: 'primary_repo',
        type: DataTypes.INTEGER
      }
    },
    {
      tableName: 'user',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
      paranoid: true,
      getterMethods: {
        fullName() {
          return `${this.firstName} ${this.lastName}`;
        }
      },
      setterMethods: {
        fullName(value) {
          const names = value.split(' ');

          this.setDataValue('first_name', names.slice(0, -1).join(' '));
          this.setDataValue('last_name', names.slice(-1).join(' '));
        }
      }
    }
  );

  User.associate = function(models) {
    User.hasMany(models.Repo, {
      foreignKey: 'user_id',
      sourceKey: 'id',
      onDelete: 'cascade',
      as: {
        singular: 'repo',
        plural: 'repos'
      }
    });
  };

  User.prototype.gravatar = (size) => {
    if (!size) {
      size = 200;
    }
    if (!this.email) {
      return `https://gravatar.com/avatar/?s=${size}&d=retro`;
    }
    const md5 = crypto
      .createHash('md5')
      .update(this.email)
      .digest('hex');
    return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
  };

  return User;
};