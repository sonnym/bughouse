import ExpressWS from "express-ws"

import logger from "./logger"

export default function(app) {
  const wss = ExpressWS(app).getWss()

  app.ws("/ws", (ws, req) => {
    logger.debug({
      label: "Websocket connection established",
      websocket: ws
    })

    ws.on("message", (message) => {
      logger.debug({
        label: "Websocket message received",
        contents: message,
        websocket: ws
      })
    })
  })
}

export const __useDefault = true
