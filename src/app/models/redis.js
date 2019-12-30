import { promisify } from "util"

import redis from "redis"

import { logger } from "~/app/index"
import { isTest } from "~/share/environment"

const REDIS_DB = isTest() ? 7 : 1

export default class Redis {
  constructor() {
    this.redis = redis.createClient({ db: REDIS_DB })
  }

  get flushdb() { return this.redis.flushdb.bind(this.redis) }

  get multi() { return this.redis.multi.bind(this.redis) }
  get end() { return this.redis.end.bind(this.redis) }

  get set() { return this.redis.set.bind(this.redis) }
  get setAsync() { return promisify(this.redis.set).bind(this.redis) }

  get getAsync() { return promisify(this.redis.get).bind(this.redis) }

  get hgetAsync() { return promisify(this.redis.hget).bind(this.redis) }
  get hgetallAsync() { return promisify(this.redis.hgetall).bind(this.redis) }

  get incr() { return this.redis.incr.bind(this.redis) }
  get decr() { return this.redis.decr.bind(this.redis) }

  subscribe(channel) {
    logger.debug(`[Redis SUB] (${channel})`)

    return this.redis.subscribe(channel)
  }

  publish(channel, message) {
    logger.debug(`[Redis PUB] (${channel}) (${message})`)

    return this.redis.publish(channel, message)
  }
}
