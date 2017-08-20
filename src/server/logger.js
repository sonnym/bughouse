import { join } from "path"
import { format } from "util"

import { Writable } from "stream"

import bunyan from "bunyan"
import { environment } from "./environment"

const logPath = join(process.cwd(), "log", environment)
let streams = [{ path: logPath }]

if (environment === "development" && process.env["DEBUG"]) {
  streams.push({
    type: "raw",
    stream: new Writable({
      objectMode: true,
      write: (obj) => process.stdout.write(`${format("%o", obj)}\n`)
    })
  })
}

const logger = bunyan.createLogger({
  name: environment,
  streams: streams
})

export default logger
