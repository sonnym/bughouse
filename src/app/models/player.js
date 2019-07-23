import Game from "./game"
import Revision from "./revision"
import Universe from "./universe"

export default class Player {
  constructor(client) {
    this.client = client
  }

  async play() {
    const result = await Universe.match(this.client)

    if (result === false) {
      this.client.send({ action: "wait" })
      return
    }

    const { game, opponent } = result
    const gameData = await game.serialize()

    await this.startGame(gameData)
    await opponent.player.startGame(gameData)
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
