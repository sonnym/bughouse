import { createConnection } from "net"

import Manager from "./manager"
import Client from "./client"

const count = parseInt(process.env["PLAYER_COUNT"], 10) || 20

process.on("beforeExit", Manager.end.bind(Manager))

new Promise((resolve, reject) => {
  createConnection(3000, "localhost", resolve)
}).then(
  Manager.run.bind(Manager, Client, count)
)
