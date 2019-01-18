import { append, reject, sort, forEach } from "ramda"

import Game from "./game"

export default class Universe {
  static init() {
    this.clients = []
    this.lobby = null

    return this
  }

  static async match(client) {
    if (this.lobby === null) {
      this.lobby = client;
      return false

    } else if (this.lobby.uuid === client.uuid) {
      return false

    } else {
      const opponent = this.lobby
      this.lobby = null

      const users = sort(() => Math.random(), [opponent.user, client.user])
      const game = await Game.forge({
        white_user_id: users[0].get("id"),
        black_user_id: users[1].get("id")
      })

      return { opponent, game }
    }
  }

  static addClient(client) {
    this.clients = append(client, this.clients)
    this.notifyClients()
  }

  static removeClient({ uuid: removeUUID }) {
    this.clients = reject(({ uuid }) => uuid === removeUUID, this.clients)
    this.notifyClients()

    if (this.lobby && this.lobby.uuid === removeUUID) {
      this.lobby = null
    }
  }

  static notifyClients() {
    forEach(client => {
      client.send({
        action: "universe",
        data: {
          universe: Universe.serialize()
        }
      })
    }, this.clients)
  }

  static serialize() {
    return {
      activeUsers: this.clients.length
    }
  }
}
