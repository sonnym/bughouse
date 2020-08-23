import test from "ava"

import Game from "~/app/models/game"
import Revision from "~/app/models/revision"

import { PENDING } from "~/share/constants/results"
import { START, MOVE } from "~/share/constants/revision_types"
import {
  STARTING_POSITION,
  WHITE,
  BLACK,
  PAWN,
  KNIGHT,
  BISHOP,
  ROOK,
  QUEEN
} from "~/share/chess"

import Factory from "@/factory"

import graph from "~/app/models/graph"

const { getGame } = graph.resolvers.Query

test("getGame: returns a serialized game", async t => {
  const whiteUser = await Factory.user()
  const blackUser = await Factory.user()

  const game = await Game.create(whiteUser, blackUser)
  const uuid = game.get("uuid")

  await Revision.move(uuid, WHITE, { from: "d2", to: "d4" })

  t.deepEqual(await getGame(null, { uuid }), {
    uuid,

    result: PENDING,

    players: [
      { color: WHITE, user: whiteUser.serialize() },
      { color: BLACK, user: blackUser.serialize() }
    ],

    revisions: [ {
      gameUUID: uuid,
      type: START,
      move: "",
      position: {
        fen: STARTING_POSITION,
        reserves: {
          [WHITE]: { [PAWN]: 0, [KNIGHT]: 0, [BISHOP]: 0, [ROOK]: 0, [QUEEN]: 0 },
          [BLACK]: { [PAWN]: 0, [KNIGHT]: 0, [BISHOP]: 0, [ROOK]: 0, [QUEEN]: 0 }
        }
      }
    }, {
      gameUUID: uuid,
      type: MOVE,
      move: "d4",
      position: {
        fen: "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq d3 0 1",
        reserves: {
          [WHITE]: { [PAWN]: 0, [KNIGHT]: 0, [BISHOP]: 0, [ROOK]: 0, [QUEEN]: 0 },
          [BLACK]: { [PAWN]: 0, [KNIGHT]: 0, [BISHOP]: 0, [ROOK]: 0, [QUEEN]: 0 }
        }
      }
    } ]
  })
})
