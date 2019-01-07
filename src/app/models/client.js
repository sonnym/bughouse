import { inspect } from "util"
import { v4 } from "uuid"

import { logger } from "./../index"

export default class Client {
  constructor(socket) {
    this.socket = socket
    this._uuid = v4()
  }

  get uuid() {
    return this._uuid
  }

  send(command) {
    logger.info({ socket: this.socket, command }, `Websocket send (${this.uuid}) ${inspect(command)}`)

    this.socket.send(JSON.stringify(command))
  }
}
