import { isNil } from "ramda"

import { Chess } from "chess.js"

import { logger } from "~/app/index"
import { MOVE, RESERVE } from "~/share/constants/revision_types"

import Model, { transaction } from "./base"

import Game from "./game"
import Position from "./position"

export default class Revision extends Model {
  get tableName() {
    return "revisions"
  }

  get hasTimestamps() {
    return true
  }

  position() {
    return this.belongsTo(Position)
  }

  static async create({ type, ...args }) {
    if (!this[type]) {
      logger.debug(`Encountered unknown revision type ${type}`)
      return
    }

    return await this[type](args)
  }

  static async move({ game, ...move }) {
    // TODO: move load into transaction for consistency
    const currentPosition = await game.getCurrentPosition()
    const initialFen = currentPosition.get("m_fen")

    const chess = new Chess(initialFen)

    if (chess.game_over()) {
      return false
    }

    const result = chess.move(move)

    if (isNil(result)) {
      return false
    }

    if (result.captured) {
      game.emit("capture", { game, piece: result.captured })
    }

    const position = new Position({
      m_fen: chess.fen(),
      white_reserve: currentPosition.get("white_reserve"),
      black_reserve: currentPosition.get("black_reserve"),
      move_number: currentPosition.get("move_number") + 1,
    })

    return await transaction(async transacting => {
      await position.save(null, { transacting })

      const revision = new Revision({
        game_id: game.get("id"),
        source_game_id: game.get("id"),
        position_id: position.get("id"),
        type: MOVE
      })

      await revision.save(null, { transacting })

      if (chess.game_over()) {
        await game.setResult(chess)
      }

      return revision
    })
  }

  static async reserve({ source, targetUUID, piece }) {
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
