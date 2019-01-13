import { startServer, logger } from "./../server/index"

import SocketHandler from "./socket"
import RouteHandler from "./route"
import AuthenticationHandler from "./authentication"

import Universe from "./models/universe"

export { logger }

export default _startServer

if (require.main === module) {
  _startServer()
}

function _startServer(port = 3000) {
  Universe.init()

  return startServer(port, {
    SocketHandler,
    RouteHandler,
    AuthenticationHandler
  })
}
