import { socketHook, startServer, logger } from "./../server/index"

import SocketHandler from "./socket"

export { logger }

socketHook(SocketHandler)
startServer()
