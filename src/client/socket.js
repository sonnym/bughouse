import logger from "./logger"

export default class Socket {
  constructor(store) {
    this.store = store

    this.socket = new WebSocket("ws://localhost:3000/ws")
    this.connected = false

    this.socket.addEventListener("open", (event) => {
      this.connected = true
      logger("WebSocket [CONNECT]")
    })

    this.socket.addEventListener("error", (event) => {
      logger("WebSocket [ERROR]")
    })

    this.socket.addEventListener("close", (event) => {
      this.connected = false
      logger("WebSocket [CLOSE]")
    })

    this.socket.addEventListener("message", (event) => {
      const { action, ...rest } = JSON.parse(event.data)

      this[action].call(this, rest)

      logger(`WebSocket [RECV] ${event.data}`)
    })
  }

  send(message) {
    this.socket.send(JSON.stringify(message))
    logger(`WebSocket [SEND] ${JSON.stringify(message)}`)
  }

  open({ data }) {
    this.store.commit("universe", data.universe)
  }
}

export const __useDefault = true
