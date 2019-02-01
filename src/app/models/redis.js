import { promisify } from "util"

import redis from "redis"

import { logger } from "~/app/index"
import { isTest } from "~/share/environment"

import { UNIVERSE_CHANNEL } from "./universe"

const REDIS_DB = isTest() ? 7 : 1

export default class Redis {
  constructor(client) {
    this.client = client

    this.redis = redis.createClient({ db: REDIS_DB })
    this.redis.on("message", this.message.bind(this))
  }

  message(channel, message) {
    logger.debug(`[Redis SUB] ${channel} ${message}`)

    switch (channel) {
      case UNIVERSE_CHANNEL:
        this.client.sendUniverse()
        break

      default:
        this.client.sendPosition({ uuid: channel }, { fen: message })
    }
  }

  get flushdbAsync() { return promisify(this.redis.flushdb).bind(this.redis) }

  get multi() { return this.redis.multi.bind(this.redis) }
  get end() { return this.redis.end.bind(this.redis) }

  get setAsync() { return promisify(this.redis.set).bind(this.redis) }
  get getAsync() { return promisify(this.redis.get).bind(this.redis) }

  get hgetAsync() { return promisify(this.redis.hget).bind(this.redis) }
  get hgetallAsync() { return promisify(this.redis.hgetall).bind(this.redis) }

  get incr() { return this.redis.incr.bind(this.redis) }
  get decr() { return this.redis.decr.bind(this.redis) }

  get publish() { return this.redis.publish.bind(this.redis) }
  get subscribeAsync() { return promisify(this.redis.subscribe).bind(this.redis) }
}
