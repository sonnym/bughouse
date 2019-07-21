<template>
  <div class="games">
    <game
      v-bind:game="games.before"
      v-bind:inverted="!inverted"
      class="medium"
    ></game>

    <game
      v-bind:game="games.primary"
      v-bind:inverted="inverted"
      class="large"
    ></game>

    <game
      v-bind:game="games.after"
      v-bind:inverted="!inverted"
      class="medium"
    ></game>
  </div>
</template>

<script>
  import Game from "./game"

  export default {
    computed: {
      games() {
        return this.$store.state.games
      },

      inverted() {
        return this.$store.state.inverted
      }
    },

    components: {
      game: Game
    }
  }
</script>

<style lang="scss" scoped>
  .games {
    height: 100%;
    width: 100%;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
</style>

<style lang="scss">
  .game.medium {
    flex: 4 0 auto;

    .board {
      width: 24vw;
      height: 24vw;

      .row {
        width: 24vw;
        height: 3vw;
      }

      .square {
        p {
          font-size: 2.75vw;
          line-height: 3vw;
        }
      }
    }
  }

  .game.large {
    flex: 2 0 auto;

    .board {
      width: 48vw;
      height: 48vw;

      .row {
        width: 48vw;
        height: 6vw;
      }

      .square {
        p {
          font-size: 5.5vw;
          line-height: 6vw;
        }
      }
    }
  }
</style>
