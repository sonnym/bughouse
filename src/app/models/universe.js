import { append, reject, forEach } from "ramda"

export default class Universe {
  static init() {
    this.clients = []
  }

  static addClient(client) {
    this.clients = append(client, this.clients)
    this.notifyClients()
  }

  static removeClient({ uuid: removeUUID }) {
    this.clients = reject(({ uuid }) => uuid === removeUUID, this.clients)
    this.notifyClients()
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
