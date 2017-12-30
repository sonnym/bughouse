import bcrypt from "bcrypt"

import Model, { transaction } from "./index"

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
    try {
      await tranaction((transacting) => {
        const user = User
          .forge((({ password }) => { { password } })(attr))
          .save(null, { transacting })

        const email = Email
          .forge(Object.assign({ user_id: user.id }, (({ email }) => {
            { value: email }
          })(attr)))
          .save(null, { transacting })
      })

      return true
    } catch(err) {
      return false
    }
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
