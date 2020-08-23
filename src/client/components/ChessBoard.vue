<template>
  <div class="board-wrapper">
    <div class="board">
      <chess-board-rank
        v-for="(squares, index) in board"
        :key="index"
        :squares="squares"
        :flip="flip"
        :dragging-coords="draggingCoords"
        @dragging="dragging"
      />
    </div>
  </div>
</template>

<script>
  import { map, reverse } from "ramda"

  import Chess, { STARTING_POSITION } from "~/share/chess"

  import ChessBoardRank from "./ChessBoardRank"

  export default {
    name: "ChessBoard",

    components: {
      ChessBoardRank
    },

    props: {
      position: {
        type: String,
        default: STARTING_POSITION
      },

      flip: Boolean,

      draggingCoords: {
        type: String,
        default: null
      }
    },

    computed: {
      board() {
        const chess = new Chess(this.position)
        const squares = chess.squares

        if (this.flip) {
          return reverse(map(reverse, squares))
        } else {
          return squares
        }
      }
    },

    methods: {
      dragging(...args) {
        this.$emit("dragging", ...args)
      }
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
