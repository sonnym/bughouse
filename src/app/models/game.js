import Model, { transaction } from "./base"

import User from "./user"

import Position from "./position"
import Revision, { TYPES } from "./revision"

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

  whiteUser() {
    return this.belongsTo(User, "white_user_id")
  }

  blackUser() {
    return this.belongsTo(User, "black_user_id")
  }

  static async create(whiteUser, blackUser) {
    const game = new Game({
      white_user_id: whiteUser.get("id"),
      black_user_id: blackUser.get("id")
    })

    const position = new Position()

    await transaction(async transacting => {
      await game.save(null, { transacting })
      await position.save(null, { transacting })

      await new Revision({
        game_id: game.get("id"),
        source_game_id: game.get("id"),
        position_id: position.get("id"),
        type: TYPES.START,
        contents: ''
      }).save(null, { transacting })
    })

    return game
  }

  async serialize() {
    const whiteUser = await this.whiteUser().refresh({ withRelated: ['profile'] })
    const blackUser = await this.blackUser().refresh({ withRelated: ['profile'] })

    return {
      whiteUser: await whiteUser.serialize(),
      blackUser: await blackUser.serialize()
    }
  }

  publish() { }

  unpublish() { }
}
