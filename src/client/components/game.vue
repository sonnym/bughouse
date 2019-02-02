<template>
  <div class="game">
    <board
      v-bind:position="position"
      v-bind:inverted="inverted"
    ></board>
  </div>
</template>

<script>
  import Board from "./board"

  export default {
    props: ["game", "inverted"],

    computed: {
      position() {
        return this.game ? this.game.currentPosition.fen : ""
      }
    },

    components: {
      board: Board
    }
  }
</script>
