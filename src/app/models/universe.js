import { promisify } from "util"

import redis from "redis"

export default class Universe {
  static get redisClient() {
    if (!this._redisClient) {
      this._redisClient = redis.createClient({ db: 1 })
    }

    return this._redisClient
  }

  static async init() {
    return await promisify(this.redisClient.set).bind(this.redisClient)("activeUsers", 0)
  }

  static async activeUsers() {
    return await promisify(this.redisClient.get).bind(this.redisClient)("activeUsers")
  }

  static async serialize() {
    return {
      activeUsers: await this.activeUsers()
    }
  }
}
