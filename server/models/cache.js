module.exports = (sequelize, DataTypes) => {
  const Cache = sequelize.define(
    'Cache',
    {
      query: {
        type: DataTypes.TEXT,
        primaryKey: true,
      },
      data: DataTypes.JSONB,
    },
    {
      tableName: 'cache',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  Cache.associate = function(_models) {
    // associations can be defined here
  };
  return Cache;
};