const Queue = require('bull');
const logger = require('./logger');

class Connection {
  static async connectToRedis() {
      if (this.githubTaskQueue) return this.githubTaskQueue;

      this.githubTaskQueue = new Queue(
        'github-queue',
        {
          redis: {
            port: process.env.REDIS_PORT,
            host: process.env.REDIS_HOSTNAME,
            password: process.env.REDIS_PASSWORD
          }
        }
      );

      await this.githubTaskQueue.isReady();
      logger.info('Connected to task queue');
      return this.db
  }
}

Connection.githubTaskQueue = null;

module.exports = { Connection }