import { find, pathEq, sortBy } from "ramda"

export default class Lobby {
  constructor(Game) {
    this.Game = Game
    this.players = []
  }

  async push(player) {
    if (find(pathEq(["client", "uuid"], player.client.uuid), this.players)) {
      return
    }

    if (this.players.length === 0) {
      this.players.push(player)
      return
    }

    const opponent = this.players.pop()

    const [whitePlayer, blackPlayer] = sortBy(
      () => { return Math.random() },
      [player, opponent]
    )

    const game = await this.Game.create(
      whitePlayer.client.user,
      blackPlayer.client.user
    )

    whitePlayer.startGame(game)
    blackPlayer.startGame(game)
  }
}
