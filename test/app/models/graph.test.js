import test from "ava"

import Game from "~/app/models/game"
import Revision from "~/app/models/revision"

import { PENDING } from "~/share/constants/results"
import { START, MOVE } from "~/share/constants/revision_types"
import { STARTING_POSITION, WHITE, BLACK } from "~/share/constants/chess"

import Factory from "@/factory"

import graph from "~/app/models/graph"

const { getGame } = graph.resolvers.Query

test("getGame: returns a serialized game", async t => {
  const whiteUser = await Factory.user()
  const blackUser = await Factory.user()

  const game = await Game.create(whiteUser, blackUser)
  const uuid = game.get("uuid")

  const revision = await Revision.move(game.get("uuid"), WHITE, { from: "d2", to: "d4" })
  t.log(revision)

  t.deepEqual(await getGame(null, { uuid }), {
    uuid,

    result: PENDING,

    players: [
      { color: WHITE, user: whiteUser.serialize() },
      { color: BLACK, user: blackUser.serialize() }
    ],

    revisions: [
      { type: START, fen: STARTING_POSITION, move: "" },
      { type: MOVE, fen: "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq d3 0 1", move: "d4" }
    ]
  })
})
