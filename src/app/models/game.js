import Model from "./base"

import User from "./user"

export default class Game extends Model {
  constructor(...args) {
    super(...args)

    this.on("created", this.publish)
    this.on("updated", this.unpublish)
  }

  get tableName() {
    return "games"
  }

  get hasTimestamps() {
    return true
  }

  get whiteUser() {
    return this.hasOne(User, "white_user_id")
  }

  get blackUser() {
    return this.hasOne(User, "black_user_id")
  }

  static async create(whiteUser, blackUser) {
    const game = new Game({
      white_user_id: whiteUser.get("id"),
      black_user_id: blackUser.get("id")
    })

    await game.save()

    return game
  }

  publish() { }

  unpublish() { }
}
