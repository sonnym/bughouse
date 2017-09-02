import http from 'http'
import url from 'url'
import { inspect } from "util"

import express from "express"

import { isDevelopment } from "./../share/environment"

import getLogger from "./logger"
import socketServer from './socket_server'

process.on("uncaughtException", (err) => {
  if (isDevelopment()) {
    console.log("EXCEPTION:")
    console.log(inspect(err))
  }
})

const app = express()
const port = 3000

export const logger = getLogger()

export function socketHook(SocketController) {
  socketServer(app, SocketController)
}

export function startServer() {
  app.listen(port, () => logger.info(`Listening on port ${port}`))
}

app.use(express.static("public"), (req, res) => {
  logger.info({ req, res }, "Served static file")
})

app.all("*", (req, res) => logger.info({ req, res }, "Invalid request"))
