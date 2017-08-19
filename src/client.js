import Board from 'alekhine'

import bughouse from './client/bughouse'
import display from './client/display'

const socket = new WebSocket("ws://localhost:3000/ws")

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
