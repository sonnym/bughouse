<template>
  <p
    class="piece text-center"
    :draggable="draggable"
    :dragging="dragging"
    @dragstart="dragstart"
    @dragend="dragend"
  >
    {{ utf8piece }}
  </p>
</template>

<script>
  import {
    PAWN,
    ROOK,
    KNIGHT,
    BISHOP,
    QUEEN,
    KING
  } from "~/share/chess"

  export default {
    name: "ChessPiece",

    props: {
      piece: {
        type: Object,
        default: () => ({})
      }
    },

    data: function() {
      return {
        dragging: false
      }
    },

    computed: {
      draggable() {
        if (this.coords === "RESERVE" && this.piece.count > 0) {
          return true
        }

        return this.$store.getters["player/moveable"](this.coords)
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

        this.dragging = true

        this.$emit("dragging", this.piece)
      },

      dragend(ev) {
        this.dragging = false
        this.$emit("dragging", null)
      }
    }
  }
</script>

<style lang="scss" scoped>
  p {
    user-select: none;
  }

  p[draggable="true"] {
    cursor: grab;
  }

  p[dragging="true"] {
    cursor: grabbing;
  }
</style>
