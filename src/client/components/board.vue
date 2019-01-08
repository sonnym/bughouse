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
  import { splitEvery } from "ramda"
  import Board from "alekhine"

  import Row from "./row"

  export default {
    props: ["position"],

    computed: {
      fenArray() {
        const board = new Board()
        board.setFen(this.position)
        return splitEvery(8, board.getState())
      }
    },

    components: {
      row: Row
    }
  }
</script>
