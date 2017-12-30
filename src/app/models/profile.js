import Model from "./base"
import User from "./user"

export default class Profile extends Model {
  get tableName() {
    return "profiles"
  }

  user() {
    this.belongsTo(User)
  }
}
