<template>
  <div class="games">
    <game
      v-bind:game="games.before"
      v-bind:inverted="!inverted"
    ></game>

    <game
      v-bind:game="games.primary"
      v-bind:inverted="inverted"
    ></game>

    <game
      v-bind:game="games.after"
      v-bind:inverted="!inverted"
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
    position: absolute;

    top: 0;
    bottom: 0;
    left: 0;
    right: 0;

    height: 100%;
    width: 100%;

    display: flex;
    flex-direction: row;
    justify-content: center;

    align-items: center;
  }
</style>

<style lang="scss">
  .games {
    .game:first-child, .game:last-child {
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

    .game:nth-child(2) {
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
  }
</style>
