const winston = require("winston");
const expressWinston = require("express-winston");

// CREATE THE CUSTOM FORMATTER
const messageFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(
    ({ level, message, meta, timestamp }) =>
      `${timestamp} ${level}: ${meta.error?.stack} || ${message}`
  )
);

// CREATE A REQUEST LOGGER
const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.Console({
      format: messageFormat,
    }),
    new winston.transports.File({
      filename: "request.log",
      format: winston.format.json(),
    }),
  ],
});

// ERROR LOGGER
const errorLogger = expressWinston.errorLogger({
  transports: [new winston.transports.File({ filename: "error.log" })],
  format: winston.format.json(),
});

module.exports = {
  requestLogger,
  errorLogger,
};
