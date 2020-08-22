<template>
  <div class="game">
    <v-sheet :class="['px-4', 'd-flex', 'flex-column']">
      <chess-player :user="topPlayer" />

      <chess-reserve
        :color="topColor"
        :reserve="topReserve"
        :turn="topColor === turn"
      />
    </v-sheet>

    <chess-board
      :position="fen"
      :flip="flip"
      :dragging-coords="draggingCoords"
      @dragging="dragging"
    />

    <v-sheet :class="['px-4', 'd-flex', 'flex-column-reverse']">
      <chess-player :user="bottomPlayer" />

      <chess-reserve
        :color="bottomColor"
        :reserve="bottomReserve"
        :turn="bottomColor === turn"
      />
    </v-sheet>
  </div>
</template>

<script>
  import { find, propEq } from "ramda"
  import { Chess } from "chess.js"

  import ChessBoard from "./ChessBoard"
  import ChessPlayer from "./ChessPlayer"
  import ChessReserve from "./ChessReserve"

  import { BLACK, WHITE, STARTING_POSITION } from "~/share/constants/chess"

  export default {
    name: "ChessGame",

    components: {
      ChessBoard,
      ChessPlayer,
      ChessReserve
    },

    props: {
      game: {
        type: Object,
        default: () => ({ })
      }
    },

    data: function() {
      return {
        draggingCoords: null
      }
    },

    computed: {
      flip() {
        const flip = this.$store.getters["flip"]

        return this.game.size === "medium" ? !flip : flip
      },

      position() {
        return this.game && this.game.currentPosition
      },

      fen() {
        return this.position ? this.position.fen : STARTING_POSITION
      },

      turn() {
        return new Chess(this.fen).turn()
      },

      topColor() {
        return this.flip ? WHITE : BLACK
      },

      bottomColor() {
        return this.flip ? BLACK : WHITE
      },

      topPlayer() {
        if (!this.game.players) {
          return
        }

        return find(propEq("color", this.topColor), this.game.players)
      },

      bottomPlayer() {
        if (!this.game.players) {
          return
        }

        return find(propEq("color", this.bottomColor), this.game.players)
      },

      topReserve() {
        if (!this.position) {
          return
        }

        return this.position.reserves[this.topColor]
      },

      bottomReserve() {
        if (!this.position) {
          return
        }

        return this.position.reserves[this.bottomColor]
      }
    },

    methods: {
      dragging(coords) {
        this.draggingCoords = coords
      }
    }
  }
</script>
