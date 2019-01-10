import Socket from "./socket"

export default function() {
  const store = this.$store
  new Socket(store)
}
