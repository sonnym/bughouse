import { find, pathEq, sortBy } from "ramda"

export default class Lobby {
  constructor(Game) {
    this.Game = Game
    this.clients = []
  }

  async push(client) {
    if (find(pathEq(["uuid"], client.uuid), this.clients)) {
      return false
    }

    if (this.clients.length === 0) {
      this.clients.push(client)

      return false
    }

    const opponent = this.clients.pop()

    const [whiteClient, blackClient] = sortBy(
      () => { return Math.random() },
      [client, opponent]
    )

    const game = await this.Game.create(
      whiteClient.user,
      blackClient.user
    )

    await game.serializePrepare()

    return { game, whiteClient, blackClient }
  }
}
