<template>
  <div class="board">
    <row
      v-for="(row, index) in board"
      v-bind:row="row"
      v-bind:key="index"
    ></row>
  </div>
</template>

<script>
  import Chess from "chess.js"

  import Row from "./row"

  const chess = new Chess()

  export default {
    props: ["position"],

    computed: {
      board() {
        chess.load(this.position)
        return chess.board()
      }
    },

    components: {
      row: Row
    }
  }
</script>

<style lang="scss" scoped>
  .board {
    box-sizing: content-box;
    border: 2px solid black;

    display: flex;
    flex-direction: column;

    margin: 0 .5vw;
  }
</style>
