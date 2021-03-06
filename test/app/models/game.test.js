import test from "ava"

import { int } from "@/core"
import Factory from "@/factory"

import Game from "~/app/models/game"

import Position from "~/app/models/position"
import Revision from "~/app/models/revision"
import User from "~/app/models/user"

import { WHITE, BLACK, STARTING_POSITION } from "~/share/chess"
import { PENDING } from "~/share/constants/results"

test("tableName method", t => {
  t.is(Game.forge().tableName, "games")
})

test("hasTimestamps method", t => {
  t.true(Game.forge().hasTimestamps)
})

test("{white,black}User association", async t => {
  const game = await Factory.game()

  const whiteUser = await game.whiteUser()
  const blackUser = await game.blackUser()

  t.true(whiteUser instanceof User)
  t.true(blackUser instanceof User)
})

test("revisions association", async t => {
  const game = await Factory.game()
  const revisions = await game.revisions().fetch()

  t.is(revisions.length, 1)
})

test("positions association", async t => {
  const game = await Factory.game()
  const positions = await game.positions().fetch()

  t.is(positions.length, 1)
})

test("currentPosition association", async t => {
  const game = await Factory.game()
  const currentPosition = await game.currentPosition().fetch()

  t.is(STARTING_POSITION, currentPosition.get("bfen"))
  t.true(currentPosition instanceof Position)

  const revisionFromGame = await game.revisions().fetchOne()
  const revisionFromPosition = await currentPosition.revision().fetch()

  t.is(
    revisionFromGame.get("id"),
    revisionFromPosition.get("id")
  )
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

test.serial("create", async t => {
  t.plan(6)

  const initialGameCount = int(await Game.count())
  const initialPositionCount = int(await Position.count())
  const initialRevisionCount = int(await Revision.count())

  const whiteUser = await Factory.user()
  const blackUser = await Factory.user()

  Game.on("create", t.pass)

  const game = await Game.create(whiteUser, blackUser)

  t.truthy(game.id)
  t.truthy(game.get("created_at"))

  t.true(int(await Game.count()) > initialGameCount)
  t.true(int(await Position.count()) > initialPositionCount)
  t.true(int(await Revision.count()) > initialRevisionCount)
})

test("serialization", async t => {
  const game = await Factory.game()
  await game.serializePrepare()

  const json = await game.serialize()

  const whiteUser = game.related("whiteUser")
  const blackUser = game.related("blackUser")

  t.is(game.get("uuid"), json.uuid)
  t.is(PENDING, json.result)

  t.is(2, json.players.length)

  t.is(WHITE, json.players[0].color)
  t.is(whiteUser.get("uuid"), json.players[0].uuid)
  t.is(1200, json.players[0].rating)
  t.is(
    whiteUser.related("profile").get("display_name"),
    json.players[0].displayName
  )

  t.is(BLACK, json.players[1].color)
  t.is(blackUser.get("uuid"), json.players[1].uuid)
  t.is(1200, json.players[1].rating)
  t.is(
    blackUser.related("profile").get("display_name"),
    json.players[1].displayName
  )

  t.is(STARTING_POSITION, json.currentPosition.fen)
  t.deepEqual(
    { p: 0, b: 0, n: 0, r: 0, q: 0 },
    json.currentPosition.reserves[WHITE]
  )
  t.deepEqual(
    { p: 0, b: 0, n: 0, r: 0, q: 0 },
    json.currentPosition.reserves[BLACK]
  )
})
