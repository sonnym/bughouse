import redis from "redis"

import { logger } from "./index"

import Client from "./models/client"

const redisClient = redis.createClient({ db: 1 })

export default (ws, req) => {
  const client = new Client(ws)

  let uuid = req.user ? req.user.get("uuid") : 'unknown'

  logger.info({ ws, user: req.user }, `Websocket [OPEN] (${client.uuid}) ${uuid}`)
  redisClient.incr("activeUsers")

  ws.on("close", () => {
    logger.info({ ws, user: req.user }, `Websocket [CLOSE] (${client.uuid}) ${uuid}`)
    redisClient.decr("activeUsers")
  })

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
