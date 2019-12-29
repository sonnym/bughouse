import { find, pathEq, sortBy } from "ramda"

export default class Lobby {
  constructor(Game) {
    this.Game = Game
    this.clients = []
  }

  async push(client) {
    if (find(pathEq(["socket", "uuid"], client.socket.uuid), this.clients)) {
      return
    }

    if (this.clients.length === 0) {
      this.clients.push(client)
      return
    }

    const opponent = this.clients.pop()

    const [whiteClient, blackClient] = sortBy(
      () => { return Math.random() },
      [client, opponent]
    )

    const game = await this.Game.create(
      whiteClient.socket.user,
      blackClient.socket.user
    )

    const gameData = await game.serialize()

    whiteClient.startGame(gameData)
    blackClient.startGame(gameData)
  }
}
