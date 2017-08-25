import { inspect } from "util"

import { v4 } from "uuid"
import ExpressWS from "express-ws"

import getLogger from "./logger"
import Controller from "./controller"

const logger = getLogger()

export default function(app) {
  const wss = ExpressWS(app).getWss()

  app.ws("/ws", (ws, req) => {
    logger.info({ ws }, "Websocket connection established")

    const controller = new Controller(mkClient(ws))

    ws.on("message", (message) => {
      logger.info({ ws, message }, `Websocket message received: ${message}`)

      try {
        (({action, ...rest}) => {
          if (!controller[action]) {
            logger.info(`Received invalid action for dispatch: ${action}`)
          } else {
            logger.info({ controller, args: rest }, `Dispatching ${action}`)

            controller[action](rest)
          }
        })(JSON.parse(message))

      } catch(err) {
        if (err instanceof SyntaxError) {
          logger.info("Received invalid JSON command")
        } else {
          throw err
        }
      }
    })
  })
}

function mkClient(ws) {
  return {
    id: v4(),
    send: (command) => {
      logger.info({ ws, command }, `Sending command: ${inspect(command)}`)

      ws.send(JSON.stringify(command))
    }
  }
}

export const __useDefault = true
