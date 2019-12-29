import { find, pathEq, sortBy } from "ramda"

export default class Lobby {
  constructor(Game) {
    this.Game = Game
    this.players = []
  }

  async push(player) {
    if (find(pathEq(["socket", "uuid"], player.socket.uuid), this.players)) {
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
      whitePlayer.socket.user,
      blackPlayer.socket.user
    )

    const gameData = await game.serialize()

    whitePlayer.startGame(gameData)
    blackPlayer.startGame(gameData)
  }
}
