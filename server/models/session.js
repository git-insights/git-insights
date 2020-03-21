module.exports = (sequelize, DataTypes) => {
  const Session = sequelize.define(
    'Session',
    {
      sid: {
        type: DataTypes.STRING(36),
        primaryKey: true
      },
      expires: DataTypes.DATE,
      data: DataTypes.TEXT
    },
    {
      tableName: 'session',
      timestamps: false,
    }
  );

  Session.associate = function(_models) {
    // associations can be defined here
  };
  return Session;
};
