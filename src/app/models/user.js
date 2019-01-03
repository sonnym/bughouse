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
        .forge((({ password }) => { password })(attr))
        .save(null, { transacting })
        .tap(async ({ id }) => {
          return await Email
            .forge((({ email }) => {
              return { user_id: id, value: email }
            })(attr))
            .save(null, { transacting })
        })
    })
  }

  async isValidPassword(plaintext) {
    return await bcrypt.compare(plaintext, this.passwordHash)
  }

  async hashPassword(user) {
    if (user.password && user.password.length > 0) {
      user.passwordHash = await bcrypt.hash(user.password, saltRounds)
    }

    delete user.attributes.password
  }
}
