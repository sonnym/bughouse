import Model from "./index"
import User from "./user"

class Profile extends Model {
  get tableName() {
    return "profiles"
  }

  user() {
    this.belongsTo(User)
  }
}
