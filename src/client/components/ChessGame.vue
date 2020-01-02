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

<style lang="scss">
  .game {
    flex: 4 0 auto;
    width: 42%;

    .board {
      .square {
        p {
          font-size: 5vmax;
          line-height: 6vmax;

          user-select: none;
        }
      }
    }

    &.medium {
      &:nth-of-type(2) {
        transform: scale(0.6) translate(25%);
      }

      &:nth-of-type(4) {
        transform: scale(0.6) translate(-25%);
      }
    }

    &.small {
      &:nth-of-type(1) {
        transform: scale(0.3) translate(215%);
      }

      &:nth-of-type(5) {
        transform: scale(0.3) translate(-215%);
      }
    }
  }
</style>
