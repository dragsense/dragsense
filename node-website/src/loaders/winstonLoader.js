const { configure, format, transports } = require("winston");

const { LoggingConfig, AppConfig } = require("../config");

module.exports = () => {
  configure({
    transports: [
      new transports.Console({
        level: LoggingConfig.LOG_LEVEL,
        handleExceptions: true,
        format:
        AppConfig.PRODUCTION
            ? format.combine(format.json())
            : format.combine(format.colorize(), format.simple()),
      }),
    ],
  });
};
