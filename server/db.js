module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOSTNAME,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    migrationStorageTableName: 'sequelize_meta',
  },
  test: {
    username: 'root',
    password: null,
    database: 'gitinsights_test',
    host: '127.0.0.1',
    port: 5432,
    dialect: 'postgres',
    migrationStorageTableName: 'sequelize_meta',
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOSTNAME,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
    migrationStorageTableName: 'sequelize_meta',
  }
};
