<template>
  <div :class="['square', color]">
    <p class="text-center">
      {{ utf8piece }}
    </p>
  </div>
</template>

<script>
  import {
    WHITE,
    BLACK,
    PAWN,
    ROOK,
    KNIGHT,
    BISHOP,
    QUEEN,
    KING
  } from "~/share/constants/chess"

  export default {
    name: "ChessBoardSquare",

    props: {
      piece: {
        type: Object,
        default: () => ({})
      },

      inverted: Boolean
    },

    computed: {
      color() {
        if (!this.piece) return null

        if (this.piece.color === BLACK) {
          return "black--text"
        } else if (this.piece.color === WHITE) {
          return "white--text"
        } else {
          return null
        }
      },

      utf8piece() {
        if (!this.piece) return null

        switch (this.piece.type) {
          case PAWN: return "♟"
          case ROOK: return "♜"
          case KING: return "♚"
          case QUEEN: return "♛"
          case KNIGHT: return "♞"
          case BISHOP: return "♝"
          default: return " "
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .square {
    flex: 1 0 auto;
    width: 12.5%;

    .black {
      color: #000000;
    }

    .white {
      color: #ffffff;
    }

    p {
      margin-bottom: 0px;

      font-size: 5vmax;
      line-height: 6vmax;

      user-select: none;
    }
  }
</style>
