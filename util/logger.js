const moment = require("moment");

module.exports.Logger = class Logger {
  /**
   * Apply color to a string
   * @param {string} colorCode - The ANSI color code
   * @param {string} text - The text to color
   * @returns {string}
   */
  static colorize(colorCode, text) {
    return `\x1b[${colorCode}m${text}\x1b[0m`;
  }

  /**
   * Log an info message
   * @param {string} message
   */
  static info(message) {
    console.log(
      `${this.colorize(94, "[INFO]")} ${moment().format("HH:mm:ss")} ${message}`
    );
  }

  /**
   * Log a warning message
   * @param {string} message
   */
  static warn(message) {
    console.log(
      `${this.colorize(93, "[WARN]")} ${moment().format("HH:mm:ss")} ${message}`
    );
  }

  /**
   * Log an error message
   * @param {string} message
   */
  static error(message) {
    console.log(
      `${this.colorize(91, "[ERROR]")} ${moment().format("HH:mm:ss")} ${message}`
    );
  }

  /**
   * Log a success message
   * @param {string} message
   */
  static success(message) {
    console.log(
      `${this.colorize(92, "[SUCCESS]")} ${moment().format(
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
      `${this.colorize(95, "[DEBUG]")} ${moment().format(
        "HH:mm:ss"
      )} ${message}`
    );
  }
};
