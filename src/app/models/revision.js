import Model from "./base"

export default class Revision extends Model {
  get tableName() {
    return "revisions"
  }
}
