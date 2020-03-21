const { createLogger, format, transports } = require('winston');
// import {
//   CustomError,
// } from './errors';

const logger = createLogger({
  level: 'info',
  defaultMeta: { service: 'insights-backend' },
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
});

// const IS_PROD = process.env.NODE_ENV === 'production';

/**
 * TODO: Figure out logging strategy
 */


// if (IS_PROD) {
//   /**
//    * Create a Winston logger that streams to Stackdriver Logging
//    */
//   const { LoggingWinston } = require('@google-cloud/logging-winston');

//   /**
//    * TODO: fix projectId & keyFileName
//    */

//   // Creates a client
//   const loggingWinston = new LoggingWinston({
//     projectId: 'your-project-id',
//     keyFilename: '/path/to/key.json',
//     format: format.combine(
//       format.timestamp(),
//       format.prettyPrint()
//     )
//   });

//   logger.add(loggingWinston);
// } else {
logger
  .add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.simple()
    )
  }));
// }

// exports a public interface instead of accessing directly the logger module
const loggerInterface = {
  info (...args) {
    logger.info(...args);
  },

  // Accepts two argument,
  // an Error object (required)
  // and an object of additional data to log alongside the error
  // If the first argument isn't an Error, it'll call logger.error with all the arguments supplied
  error (...args) {
    const [err, errorData = {}, ...otherArgs] = args;

    if (err instanceof Error) {
      // pass the error stack as the first parameter to logger.error
      const stack = err.stack || err.message || err;

      if (Object.prototype.toString.call(errorData) === '[object Object]' && !errorData.fullError) {
        // If the error object has interesting data
        // (not only httpCode, message and name from the CustomError class)
        // add it to the logs
        // if (err instanceof CustomError) {
        //   const errWithoutCommonProps = _.omit(err, ['name', 'httpCode', 'message']);

        //   if (Object.keys(errWithoutCommonProps).length > 0) {
        //     errorData.fullError = errWithoutCommonProps;
        //   }
        // } else {
        errorData.fullError = err;
        // }
      }

      const loggerArgs = [stack, errorData, ...otherArgs];

      // Treat 4xx errors that are handled as warnings, 5xx and uncaught errors as serious problems
      if (!errorData || !errorData.isHandledError || errorData.httpCode >= 500) {
        logger.error(...loggerArgs);
      } else {
        logger.warn(...loggerArgs);
      }
    } else {
      logger.error(...args);
    }
  },
};

// Logs unhandled promises errors
// when no catch is attached to a promise a unhandledRejection event will be triggered
// reason is the error, p the promise where it originated
process.on('unhandledRejection', (reason, p) => {
  loggerInterface.error(reason, 'unhandledPromiseRejection at', p);
});

module.exports = loggerInterface;
