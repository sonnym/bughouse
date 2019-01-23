import { v4 } from "uuid"

import Game from "./../../src/app/models/game"
import User from "./../../src/app/models/user"

export default class Factory {
  static async game() {
    return await Game.create(
      await User.create({
        email: `${v4()}@example.com`,
        password: v4(),
        displayName: v4()
      }),

      await User.create({
        email: `${v4()}@example.com`,
        password: v4(),
        displayName: v4()
      })
    )
  }

  static async user() {
    return await User.create({
      email: `${v4()}@example.com`,
      password: v4(),
      displayName: v4()
    })
  }
}
