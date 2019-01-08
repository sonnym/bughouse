import { v4 } from "uuid"

import { logger } from "./../index"

export default class Client {
  constructor(socket, user) {
    this.socket = socket
    this.user = user

    this._uuid = v4()
  }

  get uuid() {
    return this._uuid
  }

  send(command) {
    const json = JSON.stringify(command)

    logger.info({ socket: this.socket, command }, `Websocket [SEND] (${this.uuid}) ${json}`)

    this.socket.send(json)
  }
}
