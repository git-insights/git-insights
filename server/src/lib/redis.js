const Redis = require('ioredis');

const client = new Redis({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOSTNAME,
  family: 4, // 4 (IPv4) or 6 (IPv6)
  password: process.env.REDIS_PASSWORD,
  db: 0,
});

const subscriber = new Redis({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOSTNAME,
  family: 4, // 4 (IPv4) or 6 (IPv6)
  password: process.env.REDIS_PASSWORD,
  db: 0,
});

module.exports = {
  client,
  subscriber,
};
