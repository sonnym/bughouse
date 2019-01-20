import test from "ava"

import { v4 } from "uuid"

import { int } from "./../../helpers/core"

import Game from "./../../../src/app/models/game"
import User from "./../../../src/app/models/user"

test("tableName method", t => {
  t.is(Game.forge().tableName, "games")
})

test("hasTimestamps method", t => {
  t.true(Game.forge().hasTimestamps)
})

test("persistence", async t => {
  const initialGameCount = await int(Game.count())

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

  t.not(game.id, undefined)
  t.truthy(game.get("created_at"))

  t.is(await int(Game.count()), initialGameCount + 1)
})
