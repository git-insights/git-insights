const Redis = require('ioredis');

const options = {
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOSTNAME,
  family: 4, // 4 (IPv4) or 6 (IPv6)
  password: process.env.REDIS_PASSWORD,
  db: 0,
  connectTimeout: 17000,
  maxRetriesPerRequest: 4,
  retryStrategy: (times) => Math.min(times * 30, 1000),
  reconnectOnError: (error) => {
    const targetErrors = [/READONLY/, /ETIMEDOUT/];

    targetErrors.forEach((targetError) => {
      if (targetError.test(error.message)) {
        return true;
      }
    });
  }
}

const client = new Redis(options);
const subscriber = new Redis(options);

module.exports = {
  client,
  subscriber,
};
