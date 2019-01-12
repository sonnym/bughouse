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

    const dispatcher = this
    this.socket.addEventListener("message", (event) => {
      try {
        logger(`WebSocket [RECV] ${event.data}`)
      } catch (e) { } // eslint-disable-line

      (({ action, ...rest }) => { dispatcher[action](rest) })(JSON.parse(event.data))
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
