import test from "ava"

import redis from "redis"

import Universe from "./../../../../src/app/models/universe"

const redisClient = redis.createClient({ db: 8 })

test.beforeEach(t => {
  t.context.activeUsers = Math.floor((Math.random() * 100))
  Universe._redisClient = redisClient

  redisClient.set("activeUsers", t.context.activeUsers)
})

test.afterEach.always(t => redisClient.del("activeUsers"))

test.serial("init", async t => {
  t.is("OK", await Universe.init())
})

test.serial("activeUsers", async t => {
  t.is(t.context.activeUsers.toString(), await Universe.activeUsers())
})

test.serial("serialize", async t => {
  t.deepEqual({ activeUsers: t.context.activeUsers.toString() }, await Universe.serialize())
})
