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

  position() {
    return this.belongsTo(Position)
  }

  static async create(game, { type, ...rest }) {
    if (!this[type]) {
      logger.debug(`Encountered unknown revision type ${type}`)
      return
    }

    return await this[type](game, rest)
  }

  static async move(game, move) {
    const currentPosition = await game.currentPosition()
    const initialFen = currentPosition.get("m_fen")

    const chess = new Chess(initialFen)

    if (chess.game_over()) {
      return false
    }

    chess.move(move)

    if (initialFen === chess.fen()) {
      return false
    }

    const position = new Position({
      m_fen: chess.fen(),
      move_number: currentPosition.get("move_number") + 1
    })

    return await transaction(async transacting => {
      await position.save(null, { transacting })

      const revision = new Revision({
        game_id: game.get("id"),
        source_game_id: game.get("id"),
        position_id: position.get("id"),
        type: REVISION_TYPES.MOVE
      })

      await revision.save(null, { transacting })

      if (chess.game_over()) {
        await game.setResult(chess)
      }

      return revision
    })
  }
}
