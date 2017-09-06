import bcrypt from "bcrypt"

import model from "./index"

const saltRounds = 8

const User = model((define, {UUID, UUIDV4, STRING}) => {
  return define("users", {
    uuid: {
      type: UUID,
      defaultValue: UUIDV4
    },

    passwordHash: STRING
  })
})

User.hook("beforeSave", async (user, options) => {
  if (user.password && user.password.length > 0) {
    user.passwordHash = await bcrypt.hash(user.password, saltRounds)
  }
})

User.prototype.isValidPassword = async function(plaintext) {
  return await bcrypt.compare(plaintext, this.passwordHash)
}

export default User
