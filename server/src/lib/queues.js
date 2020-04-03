const Queue = require('bull');
const Redis = require('ioredis');
const logger = require('./logger');
const { client, subscriber } = require('./redis');

const createQueue = queueName => {
  const queue = new Queue(queueName, {
    createClient: type => {
      switch (type) {
        case 'client':
          return client;
        case 'subscriber':
          return subscriber;
        default:
          return new Redis({
            port: process.env.REDIS_PORT,
            host: process.env.REDIS_HOSTNAME,
            family: 4, // 4 (IPv4) or 6 (IPv6)
            password: process.env.REDIS_PASSWORD,
            db: 0,
          });
      }
    },
  });

  queue.isReady().then(() => {
    logger.info(`Connected to ${queueName}`);
  });

  return queue;
}

module.exports = createQueue;