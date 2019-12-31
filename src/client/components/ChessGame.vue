<template>
  <div class="game">
    <chess-player v-bind:user="topPlayer" />

    <chess-board
      v-bind:position="position"
      v-bind:inverted="inverted"
    />

    <chess-player v-bind:user="bottomPlayer" />
  </div>
</template>

<script>
  import { last } from "ramda"

  import ChessBoard from "./ChessBoard"
  import ChessPlayer from "./ChessPlayer"

  export default {
    name: "ChessGame",

    props: ["game", "inverted"],

    computed: {
      position() {
        return this.game && this.game.positions ?
          last(this.game.positions).fen :
          "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
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
    },

    components: {
      ChessBoard,
      ChessPlayer
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
