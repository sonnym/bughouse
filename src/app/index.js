import { startServer, logger } from "./../server/index"

import SocketHandler from "./socket"
import RouteHandler from "./route"
import AuthenticationHandler from "./authentication"

export { logger }

export default _startServer

export const __useDefault = true

if (require.main === module) {
  _startServer()
}

function _startServer(port = 3000) {
  return startServer(port, {
    SocketHandler,
    RouteHandler,
    AuthenticationHandler
  })
}
