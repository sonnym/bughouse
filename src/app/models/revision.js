import { Chess } from "chess.js"

import { logger } from "~/app/index"
import { REVISION_TYPES } from "~/share/constants"

import Model, { transaction } from "./base"

import Position from "./position"

export default class Revision extends Model {
  get tableName() {
    return "revisions"
  }

  get hasTimestamps() {
    return true
  }

  static async create(game, { type, ...rest }) {
    try {
      await this[type].call(null, { game, ...rest })
    } catch({ message }) {
      logger.error(message)
    }
  }

  static async move({ game, from, to, promotion }) {
    const currentPosition = await game.currentPosition()
    const currentFen = currentPosition.get("m_fen")

    const chess = new Chess(currentFen)

    if (chess.game_over()) {
      return false
    }

    chess.move({ from, to, promotion })

    if (chess.fen() === currentFen) {
      return false
    }

    const position = new Position({
      m_fen: chess.fen()
    })

    await transaction(async transacting => {
      await position.save(null, { transacting })

      const revision = new Revision({
        game_id: game.get("id"),
        source_game_id: game.get("id"),
        position_id: position.get("id"),
        type: REVISION_TYPES.MOVE
      })

      await revision.save(null, { transacting })
    })

    if (chess.game_over()) {
      await game.setResult()
    }

    return true
  }
}
