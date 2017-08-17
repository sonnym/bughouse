import socket from 'socket.io-client'

import Board from 'alekhine'

import bughouse from './client/bughouse'
import display from './client/display'

const io = socket("https://localhost")

socket.on("*", (data) => {
  console.log(data)

  socket.emit("foo", { })
})
