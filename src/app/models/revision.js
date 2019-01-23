import Model from "./base"

export default class Revision extends Model {
  get tableName() {
    return "revisions"
  }

  get hasTimestamps() {
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
