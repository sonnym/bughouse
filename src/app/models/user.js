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

  static async createWithPassword({ email, password }) {
    const user = User.forge({ password })

    await transaction(async transacting => {
      await user.save(null, { transacting })

      await Email.forge({
        user_id: user.id,
        value: email
      }).save(null, { transacting })
    })

    return user
  }

  serialize() {
    return {
      uuid: this.get("uuid")
    }
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
