import test from "ava"

import { int } from "@/core"
import Factory from "@/factory"

import Game from "~/app/models/game"

import Position from "~/app/models/position"
import Revision from "~/app/models/revision"

import User from "~/app/models/user"

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

  const whiteUser = await Factory.user()
  const blackUser = await Factory.user()

  const game = await Game.create(whiteUser, blackUser)

  t.not(game.id, undefined)
  t.truthy(game.get("created_at"))

  t.is(await int(Game.count()), initialGameCount + 1)
  t.is(await int(Position.count()), initialPositionCount + 1)
  t.is(await int(Revision.count()), initialRevisionCount + 1)
})

test("{white,black}User", async t => {
  const game = await Factory.game()

  const whiteUser = await game.whiteUser()
  const blackUser = await game.blackUser()

  t.true(whiteUser instanceof User)
  t.true(blackUser instanceof User)
})

test("revisions", async t => {
  const game = await Factory.game()

  t.is(int(await game.revisions().count()), 1)
})

test("positions", async t => {
  const game = await Factory.game()
  const positions = await game.positions().fetch()

  t.is(positions.length, 1)
})

test("currentPosition", async t => {
  const game = await Factory.game()
  const currentPosition = await game.currentPosition()

  t.true(currentPosition instanceof Position)
})

test("serialization", async t => {
  const game = await Factory.game()
  const gameData = await game.serialize()

  t.truthy(gameData)

  t.truthy(gameData.whiteUser)
  t.truthy(gameData.whiteUser.uuid)
  t.truthy(gameData.whiteUser.displayName)

  t.truthy(gameData.blackUser)
  t.truthy(gameData.blackUser.uuid)
  t.truthy(gameData.blackUser.displayName)
})
