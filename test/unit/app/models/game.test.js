import test from "ava"

import { v4 } from "uuid"

import Game from "./../../../../src/app/models/game"
import User from "./../../../../src/app/models/user"

test("tableName method", t => {
  t.is(Game.forge().tableName, "games")
})

test("hasTimestamps method", t => {
  t.true(Game.forge().hasTimestamps)
})

test("persistence", async t => {
  const whiteUser = await User.createWithPassword({
    email: `${v4()}@example.com`,
    password: v4(),
    displayName: v4()
  })

  const blackUser = await User.createWithPassword({
    email: `${v4()}@example.com`,
    password: v4(),
    displayName: v4()
  })

  const game = await Game.create(whiteUser, blackUser)

  t.truthy(game.get("created_at"))
})
