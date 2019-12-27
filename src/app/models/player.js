import Game from "./game"
import Revision from "./revision"
import Universe from "./universe"

export default class Player {
  constructor(client) {
    this.client = client
  }

  play() {
    Universe.play(this)
  }

  async revision(data) {
    const game = await Game.where({ uuid: this.client.gameUUID }).fetch()

    if (await Revision.create(game, data)) {
      game.publishPosition()
    }
  }

  async startGame(data) {
    this.client.gameUUID = data.uuid

    await this.client.redis.subscribeAsync(data.uuid)

    this.client.send({ action: "start", game: data })
  }
}
