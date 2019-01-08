<template>
  <div>
    <board
      v-for="(position, index) in positions"
      v-bind:position="position"
      v-bind:key="index"
    ></board>
  </div>
</template>

<script>
  import Board from "./board"

  export default {
    data() {
      return {
        positions: [
          "qnrnbbkr/pppppppp/8/8/8/8/PPPPPPPP/QNRNBBKR w KQkq -"
        ]
      }
    },

    components: {
      board: Board
    }
  }
</script>
