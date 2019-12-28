import Game from "./game"
import Revision from "./revision"
import Universe from "./universe"

export default class Player {
  constructor(client) {
    this.client = client
    this.serializedGame = null
  }

  play() {
    Universe.play(this)
  }

  async revision(data) {
    const game = await Game.where({ uuid: this.serializedGame.uuid }).fetch()

    if (await Revision.create(game, data)) {
      Game.emit("revision", game)
    }
  }

  async startGame(serializedGame) {
    this.serializedGame = serializedGame

    await this.client.redis.subscribeAsync(serializedGame.uuid)

    this.client.send({ action: "start", game: serializedGame })
  }
}
