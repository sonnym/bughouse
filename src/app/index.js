import { startServer, logger } from "./../server/index"

import SocketHandler from "./socket"
import RouteHandler from "./route"

export { logger }

export default startServer
export const __useDefault = true

if (require.main === module) {
  startServer(3000, {
    SocketHandler,
    RouteHandler
  })
}
