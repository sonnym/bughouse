import Model from "./base"

export default class Profile extends Model {
  get tableName() {
    return "profiles"
  }

  get hasTimestamps() {
    return true
  }
}
