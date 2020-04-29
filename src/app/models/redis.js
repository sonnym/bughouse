import { promisify } from "util"

import redis from "redis"

import { logger } from "~/app/index"

export default class Redis {
  constructor() {
    this.redis = redis.createClient({
      url: process.env["REDIS_APPLICATION_STORE_URL"]
    })
  }

  get set() { return promisify(this.redis.set).bind(this.redis) }
  get get() { return promisify(this.redis.get).bind(this.redis) }

  get hget() { return promisify(this.redis.hget).bind(this.redis) }
  get hgetall() { return promisify(this.redis.hgetall).bind(this.redis) }

  get end() { return this.redis.end.bind(this.redis) }

  get batch() { return this.redis.batch.bind(this.redis) }

  get watch() { return this.redis.watch.bind(this.redis) }
  get multi() { return this.redis.multi.bind(this.redis) }

  get incr() { return promisify(this.redis.incr).bind(this.redis) }
  get decr() { return promisify(this.redis.decr).bind(this.redis) }

  get on() { return this.redis.on.bind(this.redis) }

  subscribe(channel) {
    logger.debug(`[Redis SUB] (${channel})`)

    return this.redis.subscribe(channel)
  }

  unsubscribe(channel) {
    logger.debug(`[Redis UNSUB] (${channel})`)

    return this.redis.unsubscribe(channel)
  }

  publish(channel, message) {
    logger.debug(`[Redis PUB] (${channel}) (${message})`)

    return this.redis.publish(channel, message)
  }
}
