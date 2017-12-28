import bcrypt from "bcrypt"

import Model from "./index"

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

  async isValidPassword(plaintext) {
    return await bcrypt.compare(plaintext, this.passwordHash)
  }

  async hashPassword(user) {
    if (user.password && user.password.length > 0) {
      user.passwordHash = await bcrypt.hash(user.password, saltRounds)
    }
  }
}
