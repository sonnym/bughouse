import { find, sortBy } from "ramda"

export default class Lobby {
  constructor(Game) {
    this.Game = Game
    this.users = []
  }

  // TODO: ability to remove player

  async push(user) {
    const userAlreadyInLobby = find(lobbyUser => {
      return lobbyUser.get("uuid") === user.get("uuid")
    }, this.users)

    if (userAlreadyInLobby) {
      return
    }

    if (this.users.length === 0) {
      this.users.push(user)
      return
    }

    const opponent = this.users.pop()

    const [whiteUser, blackUser] = sortBy(
      () => { return Math.random() },
      [user, opponent]
    )

    return await this.Game.create(whiteUser, blackUser)
  }
}
