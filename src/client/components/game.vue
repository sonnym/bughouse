<template>
  <div class="game">
    <board v-bind:position="position"></board>
  </div>
</template>

<script>
  import Board from "./board"

  export default {
    props: ["game"],

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
