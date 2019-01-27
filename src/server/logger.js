import { stdout, stderr} from "process"

import { join } from "path"
import { inspect } from "util"

import { Writable } from "stream"

import { createLogger, WARN } from "bunyan"
import { environment, isDevelopment } from "./../share/environment"

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

  process.on("uncaughtException", (err) => {
    logger.error({ err }, `Uncaught Exception: ${inspect(err)}`);
  })

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
