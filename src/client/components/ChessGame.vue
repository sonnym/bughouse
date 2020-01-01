<template>
  <div class="game">
    <chess-player
      :user="topPlayer"
      :turn="topColor === turn"
    />

    <chess-board
      :position="position"
      :inverted="inverted"
    />

    <chess-player
      :user="bottomPlayer"
      :turn="bottomColor === turn"
    />
  </div>
</template>

<script>
  import { find, last, propEq } from "ramda"
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
      inverted() {
        const global = this.$store.state.inverted

        return this.game.size === "medium" ? !global : global
      },

      position() {
        return this.game &&
          this.game.positions &&
          last(this.game.positions).fen ||
          STARTING_POSITION
      },

      turn() {
        return new Chess(this.position).turn()
      },

      topColor() {
        return this.inverted ? WHITE : BLACK
      },

      bottomColor() {
        return this.inverted ? BLACK : WHITE
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
