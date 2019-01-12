import { promisify } from "util"

import redis from "redis"

const ACTIVE_USERS = "activeUsers"

export default class Universe {
  static get redisClient() {
    if (!this._redisClient) {
      this._redisClient = redis.createClient({ db: 1 })
    }

    return this._redisClient
  }

  static addUser() {
    this.redisClient.incr(ACTIVE_USERS)
  }

  static removeUser() {
    this.redisClient.decr(ACTIVE_USERS)
  }

  static async init() {
    return await promisify(this.redisClient.set).bind(this.redisClient)(ACTIVE_USERS, 0)
  }

  static async activeUsers() {
    return await promisify(this.redisClient.get).bind(this.redisClient)(ACTIVE_USERS)
  }

  static async serialize() {
    return {
      activeUsers: await this.activeUsers()
    }
  }
}
