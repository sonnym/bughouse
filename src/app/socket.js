import redis from "redis"

import { logger } from "./index"

import Client from "./models/client"
import Universe from "./models/universe"

const redisClient = redis.createClient({ db: 1 })

export default async (ws, req) => {
  const client = new Client(ws)

  let uuid = req.user ? req.user.get("uuid") : 'unknown'

  logger.info({ ws, user: req.user }, `Websocket [OPEN] (${client.uuid}) ${uuid}`)
  redisClient.incr("activeUsers")

  client.send({
    action: "connected",
    data: {
      universe: await Universe.serialize()
    }
  })

  ws.on("close", () => {
    logger.info({ ws, user: req.user }, `Websocket [CLOSE] (${client.uuid}) ${uuid}`)
    redisClient.decr("activeUsers")
  })

  ws.on("message", (message) => {
    logger.info({ ws, message }, `Websocket [RECV] (${client.uuid}) ${message}`)
  })
}

export const __useDefault = true
