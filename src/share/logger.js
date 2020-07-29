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
      const timestamp = (new Date()).toISOString()
      const level = `${info.level}:`

      let prefix, message, data

      if (typeof info.message === "string" || typeof info.message === "undefined") {
        prefix = color.white(`[CUSTOM]`)
        message = color.yellow(info.message)
        data = ""

      } else {
        const { source, event, identifier } = info.message

        prefix = color.cyan(`[${trim([source, event].join(" "))}]`)
        message = identifier ? color.white(`(${identifier})`) : ""
        data = info.message.data
      }

      const parts = [timestamp, level, prefix, message, data]

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
