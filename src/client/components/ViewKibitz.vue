<template>
  <div class="games">
    <chess-game
      v-for="game in games"
      :key="game.uuid"
      :game="game"
      :class="game.size"
      :inverted="game.inverted"
    />
  </div>
</template>

<script>
  import v4 from "uuid"

  import ChessGame from "./ChessGame"

  export default {
    name: "ViewKibitz",

    components: {
      ChessGame
    },

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
