import logger from "./logger"

export default class Socket {
  constructor() {
    this.socket = new WebSocket("ws://localhost:3000/ws")
    this.connected = false

    this.socket.addEventListener("open", (event) => {
      this.connected = true

      logger("Socket connection opened")
    })

    this.socket.addEventListener("error", (event) => {
      logger("socket error")
    })

    this.socket.addEventListener("close", (event) => {
      this.connected = false

      logger("socket closed")
    })
  }

  message(cb) {
    this.socket.addEventListener("message", (event) => {
      logger(`Received socket message: ${event.data}`)
      cb(event.data)
    })
  }

  send(message) {
    this.socket.send(JSON.stringify(message))

    logger(`Sending message: ${JSON.stringify(message)}`)
  }
}

export const __useDefault = true

