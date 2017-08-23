import ExpressWS from "express-ws"

import getLogger from "./logger"
import Controller from "./controller"

const logger = getLogger()
const controller = new Controller()

export default function(app) {
  const wss = ExpressWS(app).getWss()

  app.ws("/ws", (ws, req) => {
    logger.info({ ws }, "Websocket connection established")

    ws.on("message", (message) => {
      logger.info({ ws, message }, `Websocket message received: ${message}`)
    })
  })
}

export const __useDefault = true
