import winston, { format } from "winston"

import { trim } from "ramda"

import color from "colors/safe"
import { MESSAGE } from "triple-beam"

import { environment, isDevelopment, isTest } from "./environment"

export default function(service) {
  const logger = winston.createLogger({
    level: isDevelopment() || isTest() ? "debug" : "info",
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
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

  if (isDevelopment() || isTest()) {
    const formatter = format((info, opts) => {
      const { source, event, identifier, data } = info.message

      const parts = [
        (new Date()).toISOString(),
        `${info.level}:`,
        color.cyan(`[${trim([source, event].join(" "))}]`),
        identifier ? color.white(`(${identifier})`) : "",
        data
      ]

      info[MESSAGE] = trim(parts.join(" ")).replace(/\s+/g, " ")

      return info
    })

    logger.add(new winston.transports.Console({
      level: isTest() ? "error" : "debug",
      format: winston.format.combine(
        winston.format.colorize({
          level: true,
          colors: { debug: "yellow" }
        }),
        formatter()
      )
    }))

    logger.exceptions.handle(new winston.transports.Console({
      format: winston.format.simple()
    }))
  }

  return logger
}
