import { startServer, logger } from "~/server/index"

import RouteHandler from "./route"
import AuthenticationHandler from "./authentication"

import Universe from "./models/universe"
import Socket from "./models/socket"

import graph from "./models/graph"

export { logger }

export default _startServer

if (require.main === module) {
  _startServer()
}

function _startServer(port = 3000) {
  const universe = new Universe()

  const SocketHandler = (ws, req) => {
    new Socket(universe, ws, req.user).connected()
  }

  return startServer(port, {
    SocketHandler,
    RouteHandler,
    AuthenticationHandler,
    graph
  })
}
