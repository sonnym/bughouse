const socket = new WebSocket("ws://localhost:3000/ws")

export default class Socket {
  constructor(connectedCallback) {
    this.connected = false

    socket.addEventListener("open", (event) => {
      this.connected = true

      connectedCallback(event)
    })

    socket.addEventListener("error", (event) => {
      console.log("socket error")
    })

    socket.addEventListener("close", (event) => {
      console.log("socket closed")
    })
  }

  on(message, cb) {
    socket.addEventListener("message", (event) => {
      console.log(event.data)

      if (event.data === message) {
        cb(event)
      }
    })
  }
}

export const __useDefault = true

