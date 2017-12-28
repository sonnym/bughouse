import Model from "./index"

export default class Profile extends Model {
  get tableName() {
    return "emails"
  }
}
