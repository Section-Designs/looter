const chalk = require("chalk");
const moment = require("moment");

module.exports.Logger = class Logger {
  /**
   * Log an info message
   * @param {string} message
   */
  static info(message) {
    console.log(
      `${chalk.blueBright("[INFO]")} ${moment().format("HH:mm:ss")} ${message}`
    );
  }

  /**
   * Log a warning message
   * @param {string} message
   */
  static warn(message) {
    console.log(
      `${chalk.yellowBright("[WARN]")} ${moment().format(
        "HH:mm:ss"
      )} ${message}`
    );
  }

  /**
   * Log an error message
   * @param {string} message
   */
  static error(message) {
    console.log(
      `${chalk.redBright("[ERROR]")} ${moment().format("HH:mm:ss")} ${message}`
    );
  }

  /**
   * Log a success message
   * @param {string} message
   */
  static success(message) {
    console.log(
      `${chalk.greenBright("[SUCCESS]")} ${moment().format(
        "HH:mm:ss"
      )} ${message}`
    );
  }

  /**
   * Log a debug message
   * @param {string} message
   */
  static debug(message) {
    console.log(
      `${chalk.magentaBright("[DEBUG]")} ${moment().format(
        "HH:mm:ss"
      )} ${message}`
    );
  }
};
