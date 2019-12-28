import { startServer, logger } from "~/server/index"

import RouteHandler from "./route"
import AuthenticationHandler from "./authentication"

import Universe from "./models/universe"
import Client from "./models/client"

export { logger }

export default _startServer

if (require.main === module) {
  _startServer()
}

function _startServer(port = 3000) {
  const universe = new Universe()

  const SocketHandler = (ws, req) => {
    new Client(universe, ws, req.user).connected()
  }

  return startServer(port, {
    SocketHandler,
    RouteHandler,
    AuthenticationHandler
  })
}
