import Model from "./base"

export default class Rating extends Model {
  get tableName() {
    return "ratings"
  }

  get hasTimestamps() {
    return true
  }
}
