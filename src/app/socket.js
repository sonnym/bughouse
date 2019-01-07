import Client from "./models/client"

import { logger } from "./index"

export default (ws, req) => {
  const client = new Client(ws)

  let uuid = req.user ? req.user.get("uuid") : 'unknown'

  logger.info({ ws, user: req.user }, `Websocket [CONNECT] (${client.uuid}) ${uuid}`)

  ws.on("message", (message) => {
    logger.info({ ws, message }, `Websocket [RECV] (${client.uuid}) ${message}`)

    /*
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
    */
  })
}

export const __useDefault = true
