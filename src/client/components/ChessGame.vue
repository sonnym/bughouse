<template>
  <div class="game">
    <chess-player
      context="top"
      :user="topPlayer"
      :color="topColor"
      :reserve="topReserve"
      :turn="topColor === turn"
    />

    <chess-board
      :position="fen"
      :flip="flip"
    />

    <chess-player
      context="bottom"
      :user="bottomPlayer"
      :color="bottomColor"
      :reserve="bottomReserve"
      :turn="bottomColor === turn"
    />
  </div>
</template>

<script>
  import { find, propEq } from "ramda"
  import { Chess } from "chess.js"

  import ChessBoard from "./ChessBoard"
  import ChessPlayer from "./ChessPlayer"

  import { BLACK, WHITE, STARTING_POSITION } from "~/share/constants/chess"

  export default {
    name: "ChessGame",

    components: {
      ChessBoard,
      ChessPlayer
    },

    props: {
      game: {
        type: Object,
        default: () => ({ })
      }
    },

    computed: {
      flip() {
        const flip = this.$store.state.flip

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
    }
  }
</script>
