import winston from "winston"

import { environment, isDevelopment } from "./environment"

export default function(service) {
  const logger = winston.createLogger({
    level: isDevelopment() ? "debug" : "info",
    format: winston.format.json(),
    defaultMeta: { service: `bughouse-${service}` },
    transports: [
      new winston.transports.File({ filename: `log/${environment}.log` })
    ]
  })

  if (isDevelopment()) {
    process.on("uncaughtException", logger.error.bind(logger))

    logger.add(new winston.transports.Console({
      format: winston.format.simple()
    }))
  }

  return logger
}
