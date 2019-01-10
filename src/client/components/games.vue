<template>
  <div class="games">
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

<style lang="scss" scoped>
  .games {
    position: absolute;

    height: 100%;
    width: 100%;

    display: flex;
    flex-direction: row;
    flex-wrap: no-wrap;
    justify-content: center;
  }
</style>
