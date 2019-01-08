<template>
  <div class="square" v-bind:class="[color]">
    <p class="text-xs-center">{{ utf8piece }}</p>
  </div>
</template>

<script>
  export default {
    props: ["piece"],

    computed: {
      color() {
        if (/[A-Z]/.test(this.piece)) {
          return "black--text"
        } else if (/[a-z]/.test(this.piece)) {
          return "white--text"
        } else {
          return null
        }
      },

      utf8piece() {
        switch (this.piece.toLowerCase()) {
          case "p": return "♟"
          case "r": return "♜"
          case "n": return "♞"
          case "b": return "♝"
          case "k": return "♚"
          case "q": return "♛"
          default: return " "
        }
      }
    }
  }
</script>

