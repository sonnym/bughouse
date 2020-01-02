import Model from "./base"

export default class Position extends Model {
  get tableName() {
    return "positions"
  }

  get hasTimestamps() {
    return true
  }

  serialize() {
    return {
      fen: this.get("m_fen"),
      whiteReserve: this.get("white_reserve"),
      blackReserve: this.get("black_reserve")
    }
  }
}
