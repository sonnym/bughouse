import bcrypt from "bcrypt"

import Model, { transaction } from "./base"
import Email from "./email"

const saltRounds = 8

export default class User extends Model {
  constructor(...args) {
    super(...args)

    this.on("saving", this.hashPassword)
  }

  get tableName() {
    return "users"
  }

  get hasTimestamps() {
    return true
  }

  static async createWithPassword(attr) {
    return await transaction(async transacting => {
      return await User
        .forge({ password: attr.password })
        .save(null, { transacting })
        .tap(async (user) => {
          return await Email
            .forge((({ email }) => {
              return { user_id: user.id, value: email }
            })(attr))
            .save(null, { transacting })
        })
    })
  }

  async isValidPassword(plaintext) {
    return await bcrypt.compare(plaintext, this.get("password_hash") || '')
  }

  async hashPassword() {
    if (this.has("password") && this.get("password").length > 0) {
      this.set("password_hash", await bcrypt.hash(this.get("password"), saltRounds))
    }

    this.unset("password")
  }
}
