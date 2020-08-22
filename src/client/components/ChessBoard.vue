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
  import { map, reverse, splitEvery, zip } from "ramda"
  import { Chess } from "chess.js"

  import { SQUARES, STARTING_POSITION } from "~/share/constants/chess"

  import ChessBoardRank from "./ChessBoardRank"

  const chess = new Chess()

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
        chess.load(this.position)

        const squares = map(
          ([rankSquares, rankCoords]) => {
            return map(
              ([square, coords]) => ({ ...square, coords }),
              zip(rankSquares, rankCoords)
            )
        }, zip(chess.board(), splitEvery(8, SQUARES)))

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
