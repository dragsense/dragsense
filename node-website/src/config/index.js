const dotenv = require("dotenv");

dotenv.config();


module.exports = {
    AppConfig: require("./app-config"),
    AutoCodeConfig: require("./autocode-config"),
    DatabaseConfig: require("./database-config"),
    LoggingConfig: require("./logging-config"),
  };