import fs from "fs"
import path from "path"

import bunyan from "bunyan"
import { environment } from "./environment"

const logPath = path.join(process.cwd(), "log", environment)
let streams = [{ path: logPath }]

if (environment === "development") {
  streams.push({ stream: process.stdout })
}

const logger = bunyan.createLogger({
  name: environment,
  streams: streams
})

export default logger
