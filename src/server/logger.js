import { stdout, stderr} from "process"

import { join } from "path"
import { inspect } from "util"

import { Writable } from "stream"

import { createLogger, WARN } from "bunyan"
import { environment, isDevelopment, isTest } from "./../share/environment"

const logPath = join(process.cwd(), "log", environment)

let logger = null

export default function() {
  if (logger === null) {
    logger = createInternalLogger()
  }

  return logger
}

function createInternalLogger() {
  let streams = createStreams()

  let logger = createLogger({
    name: environment,
    streams: streams
  })

  logger.exception = (err) => {
    if (isDevelopment()) {
      stderr.write(`EXCEPTION: ${err.stack}`)
    } else if (isTest() && err.message) {
      throw err
    }
  }

  process.on("uncaughtException", logger.exception)

  return logger
}

function createStreams() {
  let streams = [{ path: logPath, level: "debug" }]

  const developmentLogger = {
    type: "raw",
    level: "debug",
    stream: new Writable({
      objectMode: true,
      write: (obj, _, cb) => {
        const output = obj.level < WARN ? stdout : stderr
        const message = obj.msg.replace(/\n/g, "").replace(/\s+/g, " ")

        output.write(`${obj.time.toISOString()}: ${message}\n`)

        cb()
      }
    })
  }

  if (isDevelopment()) {
    streams.push(developmentLogger)
  }

  return streams
}
