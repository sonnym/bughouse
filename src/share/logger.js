import winston from "winston"

import { environment, isDevelopment, isTest } from "./environment"

export default function(service) {
  const logger = winston.createLogger({
    level: isDevelopment() || isTest() ? "debug" : "info",
    format: winston.format.json(),
    defaultMeta: {
      environment,
      service: `bughouse-${service}`
    },
    transports: [
      new winston.transports.File({ filename: `log/${environment}.log` })
    ],
    exceptionHandlers: [
      new winston.transports.File({ filename: `log/${environment}.log` })
    ]
  })

  if (isDevelopment()) {
    logger.add(new winston.transports.Console({
      format: winston.format.simple()
    }))

    logger.exceptions.handle(new winston.transports.Console({
      format: winston.format.simple()
    }))
  }

  return logger
}
