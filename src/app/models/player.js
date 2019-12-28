import Game from "./game"
import Revision from "./revision"

export default class Player {
  constructor(universe, client) {
    this.universe = universe
    this.client = client

    this.serializedGame = null
  }

  play() {
    this.universe.play(this)
  }

  async startGame(serializedGame) {
    this.serializedGame = serializedGame

    await this.client.redis.subscribeAsync(serializedGame.uuid)

    this.client.send({ action: "start", game: serializedGame })
  }

  async revision(data) {
    const game = await Game.where({ uuid: this.serializedGame.uuid }).fetch()

    if (await Revision.create(game, data)) {
      Game.emit("revision", game)
    }
  }
}
