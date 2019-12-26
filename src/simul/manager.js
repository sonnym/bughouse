import { forEach } from "ramda"

import { logger } from "~/app/index"

export default class Manager {
  static clients = []

  static run(Client, count) {
    for (let n = 0; n < count; n++) {
      const client = new Client()

      this.clients.push(client)

      client.run()
    }
  }

  static end() {
    forEach(client => {
      try {
        client.close()
      } catch (e) {
        logger.info(e.message)
      }
    }, this.clients)
  }
}
