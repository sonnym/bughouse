<template>
  <div class="square" v-bind:class="[color]">
    <p class="text-xs-center">{{ utf8piece }}</p>
  </div>
</template>

<script>
  import { Chess } from "chess.js"

  const chess = new Chess()

  export default {
    props: ["piece"],

    computed: {
      color() {
        if (!this.piece) return null

        if (this.piece.color === chess.BLACK) {
          return "black--text"
        } else if (this.piece.color === chess.WHITE) {
          return "white--text"
        } else {
          return null
        }
      },

      utf8piece() {
        if (!this.piece) return null

        switch (this.piece.type) {
          case chess.PAWN: return "♟"
          case chess.ROOK: return "♜"
          case chess.KING: return "♚"
          case chess.QUEEN: return "♛"
          case chess.KNIGHT: return "♞"
          case chess.BISHOP: return "♝"
          default: return " "
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .square {
    flex: 1;

    .black {
      color: #000000;
    }

    .white {
      color: #ffffff;
    }
  }
</style>
