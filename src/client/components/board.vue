<template>
  <div class="board-wrapper">
    <div class="board">
      <row
        v-for="(row, index) in board"
        v-bind:row="row"
        v-bind:key="index"
        v-bind:inverted="inverted"
      ></row>
    </div>
  </div>
</template>

<script>
  import { map, reverse } from "ramda"
  import { Chess } from "chess.js"

  import Row from "./row"

  const chess = new Chess()

  export default {
    props: ["position", "inverted"],

    computed: {
      board() {
        chess.load(this.position)

        if (this.inverted) {
          return reverse(map(reverse, chess.board()))
        } else {
          return chess.board()
        }
      }
    },

    components: {
      row: Row
    }
  }
</script>

<style lang="scss" scoped>
  .board-wrapper {
    /* to maintain aspect ratio */
    width: 100%;
    padding-top: 100%;
    position: relative;
  }

  .board {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;

    display: flex;
    flex-direction: column;
  }
</style>
