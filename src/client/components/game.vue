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
        return this.game ? this.game.currentPosition.fen : ""
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
