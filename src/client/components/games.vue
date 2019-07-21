<template>
  <div class="games">
    <game
      v-bind:inverted="inverted"
      class="small"
    ></game>

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

    <game
      v-bind:inverted="inverted"
      class="small"
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

  function augmentGame(game, inverted, size) {
    if (game === undefined) {
      return { inverted, size, uuid: v4() }
    } else {
      return { inverted, size, uuid: v4(), ...game}
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
