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

    .game {
      flex: 4 0 auto;
      width: 42%;

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
  }
</style>
