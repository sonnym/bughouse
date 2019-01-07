import Client from "./models/client"

import { logger } from "./index"

export default (req, ws) => {
  const client = new Client(ws)

  logger.info({ ws, user: req.user }, `Websocket connect (${client.id}) ${req.user.get("uuid")}`)

  ws.on("message", (message) => {
    logger.info({ ws, message }, `Websocket message by (${client.id}): ${message}`)

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
