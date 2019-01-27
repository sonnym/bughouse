import { promisify } from "util"

import redis from "redis"

import { logger } from "./../index"
import { isTest } from "./../../share/environment"

const REDIS_DB = isTest() ? 7 : 1

export default class Redis {
  constructor(client) {
    this.client = client

    this.redis = redis.createClient({ db: REDIS_DB })
    this.redis.on("message", this.message.bind(this))
  }

  message(channel, message) {
    logger.debug(`[Redis SUB] ${channel} ${message}`)

    this.client.send({
      action: "position",
      game: { uuid: channel },
      position: { fen: message }
    })
  }

  get setAsync() { return promisify(this.redis.set).bind(this.redis) }
  get getAsync() { return promisify(this.redis.get).bind(this.redis) }

  get incr() { return this.redis.incr.bind(this.redis) }
  get decr() { return this.redis.decr.bind(this.redis) }

  get publish() { return this.redis.publish.bind(this.redis) }
  get subscribe() { return this.redis.subscribe.bind(this.redis) }
}
