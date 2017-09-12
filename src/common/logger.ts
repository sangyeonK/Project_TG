import * as winston from 'winston';
import * as winston_daily_rotate_file from 'winston-daily-rotate-file';
import * as path from 'path';

export default new winston.Logger({
  transports: [
    new winston.transports.Console({
      name: 'console_base',
      level: 'silly',
      json: false,
      colorize: true,
      prettyPrint: true,
      handleExceptions: true,
      humanReadableUnhandledException: true
    }),
    new winston_daily_rotate_file({
      name: 'file_base',
      filename: path.normalize(__dirname + '/../../logs/log'),
      prepend: true,
      level: 'silly',
      json: false,
      prettyPrint: true,
      handleExceptions: true,
      humanReadableUnhandledException: true
    })
  ],
  exitOnError: false
});
