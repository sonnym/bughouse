import socket from 'socket.io-client'

const io = socket("https://localhost")

socket.on("*", (data) => {
  console.log(data)

  socket.emit("foo", { })
})
