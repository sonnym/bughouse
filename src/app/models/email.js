import Model from "./base"

export default class Profile extends Model {
  get tableName() {
    return "emails"
  }

  get hasTimestamps() {
    return true
  }
}
