import { Chess } from "chess.js"

import Model, { transaction } from "./base"

import Position from "./position"

export default class Revision extends Model {
  get tableName() {
    return "revisions"
  }

  get hasTimestamps() {
    return true
  }

  static async move(game, from, to, promotion) {
    const currentPosition = await game.currentPosition()
    const chess = new Chess(currentPosition.get("m_fen"))

    const move = chess.move({ from, to, promotion })

    if (move === null) {
      return false
    }

    const position = Position.forge({
      m_fen: chess.fen()
    })

    await transaction(async transacting => {
      await position.save(null, { transacting })

      const revision = new Revision({
        game_id: game.get("id"),
        source_game_id: game.get("id"),
        position_id: position.get("id"),
        type: TYPES.MOVE
      })

      await revision.save(null, { transacting })
    })

    return true
  }
}

export const TYPES = {
  START: 'start',
  MOVE: 'move',
  DRAW_OFFER: 'draw_offer',
  DRAW_ACCEPT: 'draw_accept',
  DRAW_REJECT: 'draw_reject',
  RESIGN: 'resign',
  FLAG: 'flag',
  RESERVE: 'reserve'
}
