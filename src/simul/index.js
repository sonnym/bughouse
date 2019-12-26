import { createConnection } from "net"

import { forEach } from "ramda"
import { isDevelopment } from "~/share/environment"

const clients = []
const clientCount = parseInt(process.env["PLAYER_COUNT"], 10) || 20

import { logger } from "~/app/index"

import Client from "./client"

process.on("SIGINT", () => forEach(client => {
  try {
    client.close()
  } catch (e) {
    logger.info(e.message)
  }
}, clients))

if (isDevelopment()) {
  ((function simulate(count) {
    checkForServer().then(createClients())
  }()))
}

function checkForServer() {
  return new Promise((resolve, reject) => {
    createConnection(3000, "localhost", resolve)
  })
}

function createClients() {
  for (let n = 0; n < clientCount; n++) {
    const client = new Client()
    clients.push(client)

    process.nextTick(client.run.bind(client))
  }
}
