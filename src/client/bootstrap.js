import { identity } from "ramda"

import Socket from "./socket"
import query from "./graph"

export default function() {
  const socket = new Socket(this.$store)
  const fetch = (window ? window.fetch.bind(window) : fetch) || identity

  this.$store.commit("setSend", socket.send.bind(socket))
  this.$store.commit("setFetch", fetch)
  this.$store.commit("setQuery", query)
}
