import { isNil, forEach } from "ramda"

import { Chess } from "chess.js"

import { BLACK, WHITE } from "~/share/constants/chess"
import { MOVE, RESERVE, FORFEIT } from "~/share/constants/revision_types"
import { DRAW, WHITE_WIN, BLACK_WIN } from "~/share/constants/results"

import Model, { transaction } from "./base"

import Game from "./game"
import Position from "./position"
import Rating from "./rating"

export default class Revision extends Model {
  get tableName() {
    return "revisions"
  }

  get hasTimestamps() {
    return true
  }

  game() {
    return this.belongsTo(Game)
  }

  position() {
    return this.belongsTo(Position)
  }

  static async [MOVE](uuid, color, moveData) {
    return await transaction(async transacting => {
      const game = await new Game({ uuid: uuid }).fetch({
        transacting,
        withRelated: ["currentPosition", "whiteUser", "blackUser"]
      })

      const currentPosition = game.related("currentPosition")
      const initialFen = currentPosition.get("m_fen")

      const chess = new Chess(initialFen)

      if (chess.game_over()) {
        return false
      }

      if (color !== chess.turn()) {
        return false
      }

      const move = chess.move(moveData)

      if (isNil(move)) {
        return false
      }

      const position = new Position({
        m_fen: chess.fen(),
        white_reserve: currentPosition.get("white_reserve"),
        black_reserve: currentPosition.get("black_reserve"),
        move_number: currentPosition.get("move_number") + 1,
      })

      await position.save(null, { transacting })

      const revision = new Revision({
        game_id: game.get("id"),
        source_game_id: game.get("id"),
        position_id: position.get("id"),
        type: MOVE,
        move
      })

      if (chess.game_over()) {
        await setGameResult(game, getResult(chess), transacting)
      }

      await revision.save(null, { transacting })

      return revision
    })
  }

  // TODO: exit early if game is over
  static async [RESERVE](source, targetUUID, color, piece) {
    return await transaction(async transacting => {
      const target = await new Game({ uuid: targetUUID }).fetch({
        transacting,
        withRelated: ["currentPosition"]
      })

      const currentPosition = target.related("currentPosition")

      const fen = currentPosition.get("m_fen")

      const position = new Position({
        m_fen: fen,

        white_reserve: color === WHITE ?
          incrPiece(currentPosition.get("white_reserve"), piece) :
          currentPosition.get("white_reserve"),

        black_reserve: color === BLACK ?
          incrPiece(currentPosition.get("white_reserve"), piece) :
          currentPosition.get("black_reserve"),

        move_number: currentPosition.get("move_number") + 1,
      })

      await position.save(null, { transacting })

      const revision = new Revision({
        type: RESERVE,
        game_id: target.get("id"),
        source_game_id: source.get("id"),
        position_id: position.get("id")
      })

      await revision.save(null, { transacting })

      return revision
    })
  }

  static async [FORFEIT](uuid, user) {
    return await transaction(async transacting => {
      const game = await new Game({ uuid }).fetch({
        transacting,
        withRelated: ["currentPosition", "whiteUser", "blackUser"]
      })

      const revision = new Revision({
        type: FORFEIT,
        game_id: game.get("id"),
        source_game_id: game.get("id"),
        position_id: game.related("currentPosition").get("id")
      })

      if (user.get("uuid") === game.related("whiteUser").get("uuid")) {
        await setGameResult(game, BLACK_WIN, transacting)
      } else if (user.get("uuid") === game.related("blackUser").get("uuid")) {
        await setGameResult(game, WHITE_WIN, transacting)
      }

      await revision.save(null, { transacting })

      return revision
    })
  }

  serialize() {
    const move = this.get("move")

    return {
      type: this.get("type"),
      move: move && move.san ? move.san : null,
      fen: this.related("position").get("m_fen")
    }
  }
}

function getResult(chess) {
  if (chess.in_draw()) {
    return DRAW
  }

  if (chess.in_checkmate()) {
    switch (chess.turn()) {
      case WHITE: return BLACK_WIN
      case BLACK: return WHITE_WIN
    }
  }
}

async function setGameResult(game, result, transacting) {
  game.set("result", result)

  await game.save(null, { transacting })

  forEach(async (result) => {
    await result.save(null, { transacting })
  }, await Rating.calculate(game))
}

function incrPiece(reserve, piece) {
  reserve[piece]++

  return reserve
}
