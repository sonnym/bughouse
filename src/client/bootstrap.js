import Socket from "./socket"

export default function() {
  const socket = new Socket(this.$store)

  this.$store.commit("setSend", socket.send.bind(socket))
}
