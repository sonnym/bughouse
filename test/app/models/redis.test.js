import test from "ava"

import { v4 } from "uuid"

import Redis from "~/app/models/redis"

test("emits events", t => {
  const redis = new Redis()
  const uuid = v4()
  const fen = v4()

  redis.on("universe", () => { t.true(true) })
  redis.on("position", (message) => {
    t.deepEqual({ uuid, fen }, message)
  })

  redis.message("universe")
  redis.message(uuid, fen)
})
