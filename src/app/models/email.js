import Model from "./base"

export default class Email extends Model {
  constructor(...args) {
    super(...args)
  }

  get tableName() {
    return "emails"
  }

  get hasTimestamps() {
    return true
  }
}
