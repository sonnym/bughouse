<template>
  <div
    :class="['square', color, outline]"
    :data-coords="coords"
    @dragover="dragover"
    @drop="drop"
  >
    <p
      class="text-center"
      :draggable="draggable"
      @dragstart="dragstart"
    >
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

      inverted: Boolean,

      draggingCoords: {
        type: String,
        default: null
      }
    },

    computed: {
      draggable() {
        return this.$store.getters["player/moveable"](this.coords)
      },

      droppable() {
        if (!this.draggingCoords) {
          return false
        }

        return this.$store.getters["player/landable"](this.draggingCoords, this.coords)
      },

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

      outline() {
        if (this.droppable) {
          return "outline"
        }

        return ""
      },

      coords() {
        if (!this.piece) return null

        return this.piece.coords
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
    },

    methods: {
      dragstart(ev) {
        ev.dataTransfer.dropEffect = "none"
        ev.dataTransfer.setData("text/plain", JSON.stringify(this.piece))

        this.$emit("dragging", this.piece.coords)
      },

      dragover(ev) {
        ev.preventDefault()
      },

      drop(ev) {
        ev.preventDefault()

        const piece = JSON.parse(ev.dataTransfer.getData("text"))

        // TODO: handle dropping from reserve

        const from = piece.coords
        const to = this.piece.coords

        this.$store.dispatch("player/move", { from, to })
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

  .outline {
    outline-offset: -2px;
    outline: 2px solid black;
  }
</style>
