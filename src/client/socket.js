export default class Socket {
  constructor() {
    this.socket = new WebSocket("ws://localhost:3000/ws")
    this.connected = false

    this.socket.addEventListener("open", (event) => {
      this.connected = true

      console.log("Socket connection opened")
    })

    this.socket.addEventListener("error", (event) => {
      console.log("socket error")
    })

    this.socket.addEventListener("close", (event) => {
      this.connected = false

      console.log("socket closed")
    })
  }

  on(message, cb) {
    this.socket.addEventListener("message", (event) => {
      console.log(event.data)

      if (event.data === message) {
        cb(event)
      }
    })
  }

  send(message) {
    this.socket.send(JSON.stringify(message))

    console.log(`Sending message: ${JSON.stringify(message)}`)
  }
}

export const __useDefault = true

