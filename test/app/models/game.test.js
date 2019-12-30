import test from "ava"

import { Chess } from "chess.js"

import { int } from "@/core"
import Factory from "@/factory"

import Game, { RESULTS } from "~/app/models/game"

import Position from "~/app/models/position"
import Revision from "~/app/models/revision"

import User from "~/app/models/user"

test("tableName method", t => {
  t.is(Game.forge().tableName, "games")
})

test("hasTimestamps method", t => {
  t.true(Game.forge().hasTimestamps)
})

test("create", async t => {
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

test("forUser", async t => {
  const game = await Factory.game()
  const whiteUser = await game.whiteUser()
  const blackUser = await game.blackUser()

  await whiteUser.refresh(), await blackUser.refresh()

  const whiteGames = await Game.forUser(whiteUser.get("uuid"))
  const blackGames = await Game.forUser(blackUser.get("uuid"))

  t.is(whiteGames.length, 1)
  t.is(blackGames.length, 1)
  t.is(whiteGames.at(0).get("uuid"), game.get("uuid"))
  t.is(blackGames.at(0).get("uuid"), game.get("uuid"))
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

test("setResults", async t => {
  const game = await Factory.game()

  const draw = new Chess("4k3/4P3/4K3/8/8/8/8/8 b - - 0 78")
  const whiteCheckmate = new Chess("r1bqkb1r/pppp1Qpp/2n2n2/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 0 4")
  const blackCheckmate = new Chess("rnb1kbnr/pppp1ppp/8/4p3/5PPq/8/PPPPP2P/RNBQKBNR w KQkq - 1 3")

  await game.setResult(draw)
  t.is(RESULTS.DRAW, (await game.refresh()).get("result"))

  await game.setResult(whiteCheckmate)
  t.is(RESULTS.WHITE, (await game.refresh()).get("result"))

  await game.setResult(blackCheckmate)
  t.is(RESULTS.BLACK, (await game.refresh()).get("result"))
})

test("serialization", async t => {
  const game = await Factory.game()
  const gameData = await game.serialize()

  t.truthy(gameData)
  t.truthy(gameData.uuid)

  t.is(gameData.result, "-")

  t.truthy(gameData.whiteUser)
  t.truthy(gameData.whiteUser.uuid)
  t.truthy(gameData.whiteUser.displayName)

  t.truthy(gameData.blackUser)
  t.truthy(gameData.blackUser.uuid)
  t.truthy(gameData.blackUser.displayName)

  t.truthy(gameData.positions)
  t.truthy(gameData.currentPosition)
})
