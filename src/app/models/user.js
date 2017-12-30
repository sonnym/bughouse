import bcrypt from "bcrypt"

import Model, { transaction } from "./index"
import Email from "./email"

const saltRounds = 8

export default class User extends Model {
  constructor() {
    super()

    this.on("saving", this.hashPassword)
  }

  get tableName() {
    return "users"
  }

  get hasTimestamps() {
    return true
  }

  static async createWithPassword(attr) {
    return await transaction(transacting => {
      return User
        .forge((({ password }) => { password })(attr))
        .save(null, { transacting })
        .tap(({ id }) => {
          return Email
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
  }
}
