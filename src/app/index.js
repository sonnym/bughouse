import { socketHook, startServer, logger } from "./../server/index"
import SocketController from "./controllers/socket"

export { logger }

socketHook(SocketController)
startServer()
