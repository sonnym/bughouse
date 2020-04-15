import { forEach } from "ramda"

import { Chess } from "chess.js"

import { MOVE, RESERVE } from "~/share/constants/revision_types"

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

  static async [MOVE](uuid, moveData) {
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

      const move = chess.move(moveData)

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
        game.setResult(chess)

        await game.save(null, { transacting })

        forEach(async (result) => {
          await result.save(null, { transacting })
        }, await Rating.calculate(game))
      }

      await revision.save(null, { transacting })

      return revision
    })
  }

  static async [RESERVE](source, targetUUID, piece) {
    return await transaction(async transacting => {
      const target = await new Game({ uuid: targetUUID }).fetch({
        transacting,
        withRelated: ["currentPosition"]
      })

      const currentPosition = target.related("currentPosition")

      const position = new Position({
        m_fen: currentPosition.get("m_fen"),
        white_reserve: incrPiece(currentPosition.get("white_reserve"), piece),
        black_reserve: incrPiece(currentPosition.get("black_reserve"), piece),
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

    function incrPiece(reserve, piece) {
      if (piece in reserve) {
        reserve[piece]++
      }

      return reserve
    }
  }
}
