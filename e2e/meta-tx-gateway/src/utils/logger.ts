import winston, { format } from "winston";

const sharedLogTransports = [
  new winston.transports.Console({
    level: process.env.LOG_LEVEL || "debug"
  })
];

export const logger = winston.createLogger({
  format: format.combine(
    format.timestamp(),
    winston.format.printf(({ level, message, timestamp }) => {
      return `level=${level} date=${timestamp} message="${message}"`;
    })
  ),
  transports: sharedLogTransports,
  exitOnError: false
});

export const httpWinstonLogger = winston.createLogger({
  format: winston.format.printf(({ level, message }) => {
    return `level=${level} ${message}`;
  }),
  transports: sharedLogTransports,
  exitOnError: false
});
