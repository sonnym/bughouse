<template>
  <transition-group tag="div" class="games">
    <game
      v-for="game in games"
      v-bind:game="game"
      v-bind:key="game.uuid"
      v-bind:class="game.size"
      v-bind:inverted="game.inverted"
    ></game>
  </transition-group>
</template>

<script>
  import v4 from "uuid"

  import Game from "./game"

  export default {
    data: function() {
      return {
        inverted: this.$store.state.inverted
      }
    },

    computed: {
      games() {
        const games = this.$store.state.games
        const inverted = this.inverted

        return [
          augmentGame(undefined, inverted, "small"),
          augmentGame(games.before, !inverted, "medium"),
          augmentGame(games.primary, inverted, "large"),
          augmentGame(games.after, !inverted, "medium"),
          augmentGame(undefined, inverted, "small")
        ]
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
