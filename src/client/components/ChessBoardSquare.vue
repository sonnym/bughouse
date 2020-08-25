<template>
  <div
    :class="['square', color, outline]"
    :data-coords="coords"
    @dragover="dragover"
    @drop="drop"
  >
    <chess-piece
      :piece="piece"
      @dragging="dragging"
    />
  </div>
</template>

<script>
  import { WHITE, BLACK } from "~/share/chess"

  import ChessPiece from "./ChessPiece"

  export default {
    name: "ChessBoardSquare",

    components: {
      ChessPiece
    },

    props: {
      piece: {
        type: Object,
        default: () => ({})
      },

      inverted: Boolean,

      draggingPiece: {
        type: Object,
        default: () => ({ })
      }
    },

    computed: {
      coords() {
        if (!this.piece) return null

        return this.piece.coords
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

      droppable() {
        if (!this.draggingPiece) {
          return false
        }

        const { coords, type } = this.draggingPiece

        if (!coords) {
          return false
        }

        if (coords === "RESERVE") {
          return this.$store.getters["player/droppable"](type, this.coords)
        } else {
          return this.$store.getters["player/landable"](coords, this.coords)
        }
      },
    },

    methods: {
      dragover(ev) {
        ev.preventDefault()
      },

      drop(ev) {
        ev.preventDefault()

        const piece = JSON.parse(ev.dataTransfer.getData("text"))

        const from = piece.coords
        const to = this.piece.coords

        if (from === "RESERVE") {
          this.$store.dispatch("player/drop", { piece: piece.type, square: to })
        } else {
          this.$store.dispatch("player/move", { from, to })
        }
      },

      dragging(...args) {
        this.$emit("dragging", ...args)
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

    .piece {
      margin-bottom: 0px;

      font-size: 5vmax;
      line-height: 6vmax;
    }
  }

  .outline {
    outline-offset: -2px;
    outline: 2px solid black;
  }
</style>
