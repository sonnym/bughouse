import logger from "./logger"

export default class Socket {
  constructor(store) {
    this.store = store
    this.connect()
  }

  connect() {
    this.socket = new WebSocket("ws://localhost:3000/ws")

    this.socket.addEventListener("open", this.open.bind(this))
    this.socket.addEventListener("error", this.error.bind(this))
    this.socket.addEventListener("close", this.close.bind(this))
    this.socket.addEventListener("message", this.message.bind(this))
  }

  open(event) { logger("WebSocket [CONNECT]") }
  error(event) { logger("WebSocket [ERROR]") }

  close(event) {
    logger("WebSocket [CLOSE]")
    this.connect()
  }

  message(event) {
    logger(`WebSocket [RECV] ${event.data}`)

    const { action, ...rest } = JSON.parse(event.data)
    this[action].call(this, rest)
  }

  send(message) {
    this.socket.send(JSON.stringify(message))
    logger(`WebSocket [SEND] ${JSON.stringify(message)}`)
  }

  universe({ data }) {
    this.store.commit("universe", data.universe)
  }
}
