import { socketHook, routerHook, startServer, logger } from "./../server/index"

import SocketHandler from "./socket"
import RouteHandler from "./route"

export { logger }

socketHook(SocketHandler)
routerHook(RouteHandler)

startServer()
