<template>
  <div class="games">
    <chess-game
      v-for="game in games"
      :key="game.uuid"
      :game="game"
      :class="game.size"
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

    computed: {
      games() {
        const games = this.$store.state.games

        return [
          augmentGame(undefined, "small"),
          augmentGame(games.before, "medium"),
          augmentGame(games.primary, "large"),
          augmentGame(games.after, "medium"),
          augmentGame(undefined, "small")
        ]
      }
    }
  }

  function augmentGame(game, size) {
    if (game === undefined) {
      return { size, uuid: v4() }
    } else {
      return { size, ...game}
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
