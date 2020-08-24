import Model from "./base"

import { WHITE, BLACK } from "~/share/chess"

import Revision from "./revision"

export default class Position extends Model {
  get tableName() {
    return "positions"
  }

  get hasTimestamps() {
    return true
  }

  revision() {
    return this.hasOne(Revision)
  }

  serialize() {
    return {
      fen: this.get("bfen"),
      reserves: {
        [WHITE]: this.get("white_reserve"),
        [BLACK]: this.get("black_reserve")
      }
    }
  }
}
