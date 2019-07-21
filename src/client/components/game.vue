<template>
  <div class="game">
    <player v-bind:user="topPlayer"></player>

      <board
        v-bind:position="position"
        v-bind:inverted="inverted"
      ></board>

    <player v-bind:user="bottomPlayer"></player>
  </div>
</template>

<script>
  import Board from "./board"
  import Player from "./player"

  export default {
    props: ["game", "inverted"],

    computed: {
      position() {
        return this.game && this.game.currentPosition ?
          this.game.currentPosition.fen : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
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
      board: Board,
      player: Player
    }
  }
</script>

<style lang="scss">
  .game {
    margin: 0 .5%;

    &.large {
      flex: 4 0 auto;
      width: 50%;

      .board {
        .square {
          p {
            font-size: 5.5vmax;
            line-height: 6.5vmax;
          }
        }
      }
    }

    &.medium {
      flex: 2 0 auto;
      width: 23%;

      .board {
        .square {
          p {
            font-size: 2.5vmax;
            line-height: 3vmax;
          }
        }
      }
    }

    &.small {
      flex: 1 0 auto;
      width: 11.5%;

      .board {
        .square {
          p {
            font-size: 1.25vmax;
            line-height: 1.5vmax;
          }
        }
      }
    }
  }
</style>
