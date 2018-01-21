import { socketHook, routerHook, startServer, logger } from "./../server/index"

import SocketHandler from "./socket"
import RouteHandler from "./route"

export { logger }

socketHook(SocketHandler)
routerHook(RouteHandler)

export default startServer
export const __useDefault = true

if (require.main === module) {
  startServer()
}
