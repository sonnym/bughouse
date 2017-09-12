import bcrypt from "bcrypt"

import Model from "./index"

const saltRounds = 8

class User extends Model {
  constructor() {
    super()

    this.on("saving", (user) => this.hashPassword(user))
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

  async hashPassord(user) {
    if (user.password && user.password.length > 0) {
      user.passwordHash = await bcrypt.hash(user.password, saltRounds)
    }
  }
}

export default User
