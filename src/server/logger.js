import { join } from "path"
import { format, inspect } from "util"

import { Writable } from "stream"

import bunyan from "bunyan"
import { environment } from "./../share/environment"

const logPath = join(process.cwd(), "log", environment)

let logger = null

export default function() {
  if (logger === null) {
    logger = createLogger()
  }

  return logger
}

function createLogger() {
  let streams = createStreams()

  let logger = bunyan.createLogger({
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

  if (environment === "development") {
    streams.push({
      type: "raw",
      level: "info",
      stream: new Writable({
        objectMode: true,
        write: (obj, _, cb) => {
          process.stdout.write(`${obj.time}: ${obj.msg}\n`)
          cb()
        }
      })
    })
  }

  return streams
}
