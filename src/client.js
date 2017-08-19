import Board from 'alekhine'

import bughouse from './client/bughouse'

const socket = new WebSocket("ws://localhost:3000/ws")

window.bughouse = bughouse()

socket.addEventListener("open", (event) => {
  console.log("socket opened")

  socket.send("Hello Server")
})

socket.addEventListener("message", (event) => {
  console.log(event.data)
})

socket.addEventListener("error", (event) => {
  console.log("socket error")
})

socket.addEventListener("close", (event) => {
  console.log("socket closed")
})
