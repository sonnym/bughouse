import test from "ava"

import Factory from "@/factory"

import { Chess } from "chess.js"

import { DRAW, WHITE_WIN, BLACK_WIN } from "~/share/constants/results"
import { WHITE, BLACK, PAWN, QUEEN } from "~/share/constants/chess"
import { MOVE, FORFEIT } from "~/share/constants/revision_types"

import Revision from "~/app/models/revision"

test("tableName", t => {
  t.is(Revision.forge().tableName, "revisions")
})

test("hasTimestamps", t => {
  t.true(Revision.forge().hasTimestamps)
})

test.serial("move: when valid, creates revision", async t => {
  t.plan(5)

  Revision.on("create", t.pass)

  const game = await Factory.game()
  const uuid = game.get("uuid")
  const move = { from: "e2", to: "e4" }

  const revision = await Revision.move(uuid, WHITE, move)
  const position = await revision.position().fetch()

  t.truthy(revision.get("move"))
  t.truthy(revision)

  t.is(1, position.get("move_number"))
  t.is(
    "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1",
    position.get("m_fen")
  )
})

test("move: when invalid, does not create revision", async t => {
  const game = await Factory.game()
  const uuid = game.get("uuid")
  const move = { game, from: "e2", to: "e2", promotion: null }

  t.false(await Revision.move(uuid, WHITE, move))
})

test("move: when game is over, does not create revision", async t => {
  const fen = "4k3/4P3/4K3/8/8/8/8/8 b - - 0 78"
  const game = await Factory.game({ fen })
  const uuid = game.get("uuid")

  t.false(await Revision.move(uuid, BLACK))
})

test("move: color is not current to move", async t => {
  const game = await Factory.game()
  const uuid = game.get("uuid")
  const move = { game, from: "e2", to: "e2", promotion: null }

  t.false(await Revision.move(uuid, BLACK, move))
})

test.serial("reserve: increments move number and stores piece", async t => {
  t.plan(3)

  Revision.on("create", t.pass)

  const source = await Factory.game()
  const target = await Factory.game()

  const piece = "p"

  const revision = await Revision.reserve(source, target.get("uuid"), BLACK, piece)
  await revision.refresh({ withRelated: ["position"] })

  const position = revision.related("position")

  t.is(1, position.get("move_number"))
  t.is(1, position.get("black_reserve")[piece])
})

test("drop: disallows pawns from being placed on first and eigth rank", async t => {
  const specs = [
    { square: "a1", color: WHITE },
    { square: "a1", color: BLACK },
    { square: "h8", color: WHITE },
    { square: "h8", color: BLACK }
  ]

  for (const { square, color } of specs) {
    const game = await Factory.game({ fen: `2qk4/8/8/8/8/8/8/2QK4 ${color} - - 0 1` })

    t.false(await Revision.drop(game.get("uuid"), color, PAWN, square))
  }
})

test("drop: requires a piece in the reserve", async t => {
  const game = await Factory.game()

  t.false(await Revision.drop(game.get("uuid"), WHITE, PAWN, "e4"))
})

test("drop: not allowed when not the current turn", async t => {
  const game = await Factory.game({
    reserves: { [BLACK]: { [PAWN]: 1 } }
  })

  t.false(await Revision.drop(game.get("uuid"), BLACK, PAWN, "e4"))
})

test.serial("drop: success decrements reserve", async t => {
  t.plan(2)

  Revision.on("create", t.pass)

  const game = await Factory.game({
    fen: "rnb1k2r/pppp1ppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    reserves: { [WHITE]: { [QUEEN]: 1 } }
  })

  await Revision.drop(game.get("uuid"), WHITE, QUEEN, "e5")
  await game.refresh({ withRelated: ["currentPosition"] })

  t.is(0, game.related("currentPosition").get("white_reserve")[QUEEN])
})

test.todo("resign")

test.serial("forfeit: white user", async t => {
  t.plan(3)

  Revision.on("create", t.pass)

  const game = await Factory.game()
  await game.refresh({ withRelated: ["whiteUser"] })

  const user = game.related("whiteUser")

  const revision = await Revision.forfeit(game.get("uuid"), user)

  t.is(FORFEIT, revision.get("type"))
  t.is(BLACK_WIN, (await game.refresh()).get("result"))
})

test.serial("forfeit: black user", async t => {
  t.plan(3)

  Revision.on("create", t.pass)

  const game = await Factory.game()
  await game.refresh({ withRelated: ["blackUser"] })

  const user = game.related("blackUser")

  const revision = await Revision.forfeit(game.get("uuid"), user)

  t.is(FORFEIT, revision.get("type"))
  t.is(WHITE_WIN, (await game.refresh()).get("result"))
})

test("serialize", async t => {
  const game = await Factory.game()

  const revision = await Revision.move(
    game.get("uuid"),
    WHITE,
    { from: "g1", to: "f3" },
  )

  await revision.refresh({ withRelated: ["position"] })

  t.deepEqual({
    fen: "rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R b KQkq - 1 1",
    move: "Nf3",
    type: MOVE
  }, revision.serialize())
})

test.skip("setResults", async t => {
  const game = await Factory.game()

  const draw = new Chess("4k3/4P3/4K3/8/8/8/8/8 b - - 0 78")
  const whiteCheckmate = new Chess("r1bqkb1r/pppp1Qpp/2n2n2/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 0 4")
  const blackCheckmate = new Chess("rnb1kbnr/pppp1ppp/8/4p3/5PPq/8/PPPPP2P/RNBQKBNR w KQkq - 1 3")

  game.setResult(draw)
  t.is(DRAW, game.get("result"))
  t.true(game.hasChanged("result"))

  game.setResult(whiteCheckmate)
  t.is(WHITE_WIN, game.get("result"))
  t.true(game.hasChanged("result"))

  game.setResult(blackCheckmate)
  t.is(BLACK_WIN, game.get("result"))
  t.true(game.hasChanged("result"))
})
