import test from "ava"

import { v4 } from "uuid"

import { int } from "./../../helpers/core"

import Game from "./../../../src/app/models/game"

import Position from "./../../../src/app/models/position"
import Revision from "./../../../src/app/models/revision"

import User from "./../../../src/app/models/user"

test("tableName method", t => {
  t.is(Game.forge().tableName, "games")
})

test("hasTimestamps method", t => {
  t.true(Game.forge().hasTimestamps)
})

test("persistence", async t => {
  const initialGameCount = await int(Game.count())
  const initialPositionCount = await int(Position.count())
  const initialRevisionCount = await int(Revision.count())

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
  t.is(await int(Position.count()), initialPositionCount + 1)
  t.is(await int(Revision.count()), initialRevisionCount + 1)
})
