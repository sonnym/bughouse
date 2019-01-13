import { append, reject } from "ramda"

export default class Universe {
  static init() {
    this.clients = []
  }

  static addClient(client) {
    this.clients = append(client, this.clients)
  }

  static removeClient({ uuid: removeUUID }) {
    this.clients = reject(({ uuid }) => uuid === removeUUID, this.clients)
  }

  static serialize() {
    return {
      activeUsers: this.clients.length
    }
  }
}
