<template>
  <div class="board-wrapper">
    <div class="board">
      <chess-board-rank
        v-for="(rank, index) in board"
        :key="index"
        :rank="rank"
        :inverted="inverted"
      />
    </div>
  </div>
</template>

<script>
  import { map, reverse } from "ramda"
  import { Chess } from "chess.js"

  import { STARTING_POSITION } from "~/share/constants/chess"

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

      inverted: Boolean
    },

    computed: {
      board() {
        chess.load(this.position)

        if (this.inverted) {
          return reverse(map(reverse, chess.board()))
        } else {
          return chess.board()
        }
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
