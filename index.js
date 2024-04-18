const winston = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");

class Logger {
  constructor() {
    this.logDir = "logs";
    this.fileSize = null;
    this.formatType = null;
  }

  setLogDir(dir) {
    this.logDir = dir;
  }

  setSize(size) {
    this.fileSize = size;
  }

  setFormateType(type) {
    this.formatType = type;
  }

  getFormat(fileName) {
    const self = this;
    if (this.formatType === "tab") {
      return winston.format.printf(({ level, message, timestamp, ...meta }) => {
        let metaData = "";
        let tags = meta[Symbol.for("splat")];
        if (tags && tags.length > 0) {
          metaData = tags.join();
        }
        return `${timestamp}\t${fileName}\t${level}\t${JSON.stringify(message)}\t${metaData}`;
      });
    } else {
      return winston.format.printf(({ level, message, timestamp, ...meta }) => {
        let metaData = "";
        let tags = meta[Symbol.for("splat")];
        if (tags && tags.length > 0) {
          metaData = tags.join();
        }
        return `${timestamp} : ${level} : ${JSON.stringify(message)} : ${metaData}`;
      });
    }
  }

  format(fileName) {
    return winston.format.combine(
      winston.format.timestamp(),
      this.getFormat(fileName)
    );
  }

  fileTransport(label) {
    return new DailyRotateFile({
      filename: `${this.logDir}/${label}_%DATE%.log`,
      datePattern: "YYYY_MM_DD",
      maxSize: this.fileSize,
    });
  }

  createLog(fileName) {
    return winston.createLogger({
      format: this.format(fileName),
      transports: [this.fileTransport(fileName)],
    });
  }
}

module.exports = Logger;