const io = require("socket.io-client")

import Board from 'alekhine'

import bughouse from './client/bughouse'
import display from './client/display'

const socket = io("http://localhost")

socket.on("*", (data) => {
  console.log(data)

  socket.emit("foo", { })
})
