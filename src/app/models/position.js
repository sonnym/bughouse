import Model from "./base"

import { WHITE, BLACK } from "~/share/constants/chess"

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
      reserves: {
        [WHITE]: this.get("white_reserve"),
        [BLACK]: this.get("black_reserve")
      }
    }
  }
}
