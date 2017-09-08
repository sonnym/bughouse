import { inspect } from "util"

import express from "express"

import { isDevelopment } from "./../share/environment"

import loggerServer from "./logger"
import socketServer from './socket'

process.on("uncaughtException", (err) => {
  if (isDevelopment()) {
    console.log("EXCEPTION:")
    console.log(inspect(err))
  }
})

const app = express()

export const logger = loggerServer()
export const socketHook = SocketController => socketServer(app, SocketController)
export const routerHook = routerGenerator => routerGenerator(app, express.Router)

export function startServer(port = 3000) {
  app.use((req, res, next) => {
    logger.info({ req }, `Requested by (${req.ip}): ${req.path}`)
    next()
  })

  app.use(express.static("public"), (req, res, next) => {
    if (res.outputSize === 0) {
      next()
    } else {
      logger.info({ req, res }, `Served static file: ${req.path}`)
    }
  })

  app.all("*", (req, res, next) => {
    logger.info({ req, res }, `Invalid request: ${req.path}`)
    next()
  })

  app.listen(port, () => logger.info(`Listening on port ${port}`))
}
