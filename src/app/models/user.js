import bcrypt from "bcrypt"

import Model, { transaction } from "./base"

import Email from "./email"
import Profile from "./profile"

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

  profile() {
    return this.hasOne(Profile, "provider_id")
  }

  static async create({ email, password, displayName }) {
    const user = User.forge({ password })

    await transaction(async transacting => {
      await user.save(null, { transacting })

      await Email.forge({
        user_id: user.id,
        value: email
      }).save(null, { transacting })

      await Profile.forge({
        name: { },
        provider: "local",
        provider_id: user.id,
        display_name: displayName
      }).save(null, { transacting })
    })

    return user
  }

  serialize() {
    return {
      uuid: this.get("uuid"),
      displayName: this.profile().get("display_name")
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
