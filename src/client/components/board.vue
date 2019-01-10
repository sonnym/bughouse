<template>
  <div class="board">
    <row
      v-for="(row, index) in fenArray"
      v-bind:row="row"
      v-bind:key="index"
    ></row>
  </div>
</template>

<script>
  import { reverse, splitEvery } from "ramda"
  import Board from "alekhine"

  import Row from "./row"

  export default {
    props: ["position"],

    computed: {
      fenArray() {
        const board = new Board()
        board.setFen(this.position)
        return splitEvery(8, reverse(board.getState())).map(row => reverse(row))
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

    margin: 0 auto;
  }
</style>
