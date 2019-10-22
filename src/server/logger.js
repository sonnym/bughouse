import winston from "winston"

import { environment, isDevelopment } from "~/share/environment"

const logger = winston.createLogger({
  level: isDevelopment() ? "debug" : "info",
  format: winston.format.json(),
  defaultMeta: { service: "bughouse-express" },
  transports: [
    new winston.transports.File({ filename: `logs/${environment}.log` })
  ]
})

if (isDevelopment()) {
  process.on("uncaughtException", logger.error.bind(logger))

  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }))
}

export default logger
