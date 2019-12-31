<template>
  <div class="game">
    <chess-player :user="topPlayer" />

    <chess-board
      :position="position"
      :inverted="inverted"
    />

    <chess-player :user="bottomPlayer" />
  </div>
</template>

<script>
  import { last } from "ramda"

  import ChessBoard from "./ChessBoard"
  import ChessPlayer from "./ChessPlayer"

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
      },

      inverted: Boolean
    },

    computed: {
      position() {
        return this.game && this.game.positions && last(this.game.positions).fen
      },

      topPlayer() {
        if (!this.game) {
          return { }
        }

        return this.inverted ? this.game.whiteUser : this.game.blackUser
      },

      bottomPlayer() {
        if (!this.game) {
          return { }
        }

        return this.inverted ? this.game.blackUser : this.game.whiteUser
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
