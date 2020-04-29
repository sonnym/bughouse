import logger from "./logger"

export default class Socket {
  constructor(store) {
    this.store = store
    this.connect()
  }

  connect() {
    try {
      this.socket = new WebSocket("ws://localhost:3000/ws")
    } catch(e) { } // eslint-disable-line no-empty

    this.socket.addEventListener("open", this.open.bind(this))
    this.socket.addEventListener("error", this.error.bind(this))
    this.socket.addEventListener("close", this.close.bind(this))
    this.socket.addEventListener("message", this.message.bind(this))
  }

  open(event) {
    logger("WebSocket [CONNECT]")

    this.store.commit("socketConnected")
  }

  error(event) { logger("WebSocket [ERROR]") }

  close(event) {
    logger("WebSocket [CLOSE]")

    this.store.commit("socketDisconnected")

    // TODO: exponential backoff, trampoline
    this.connect()
  }

  message({ data }) {
    logger(`WebSocket [RECV] ${data}`)

    const { action, ...payload } = JSON.parse(data)

    try {
      this.store.dispatch(action, payload)
    } catch(e) { logger.debug(e) } // eslint-disable-line no-empty
  }

  send(message) {
    this.socket.send(JSON.stringify(message))
    logger(`WebSocket [SEND] ${JSON.stringify(message)}`)
  }
}
