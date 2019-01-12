import logger from "./logger"

export default class Socket {
  constructor(store) {
    this.store = store
    this.connect()
  }

  connect() {
    this.socket = new WebSocket("ws://localhost:3000/ws")

    this.socket.addEventListener("open", (event) => {
      logger("WebSocket [CONNECT]")
    })

    this.socket.addEventListener("error", (event) => {
      logger("WebSocket [ERROR]")
    })

    this.socket.addEventListener("close", (event) => {
      logger("WebSocket [CLOSE]")

      this.connect()
    })

    this.socket.addEventListener("message", (event) => {
      logger(`WebSocket [RECV] ${event.data}`)

      const { action, ...rest } = JSON.parse(event.data)
      this[action].call(this, rest)
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
