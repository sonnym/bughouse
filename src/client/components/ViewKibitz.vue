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
  import { v4 } from "uuid"
  import { mapState } from "vuex"

  import { KIBITZ, LEAVE } from "~/share/constants/actions"

  import ChessGame from "./ChessGame"

  export default {
    name: "ViewKibitz",

    components: {
      ChessGame
    },

    computed: {
      games() {
        const games = this.$store.getters["games"]

        return [
          augmentGame(undefined, "small"),
          augmentGame(games.before, "medium"),
          augmentGame(games.primary, "large"),
          augmentGame(games.after, "medium"),
          augmentGame(undefined, "small")
        ]
      },
      ...mapState(["connected"])
    },

    watch: {
      connected(newValue, oldValue) {
        if (newValue) {
          this.$store.state.send({ action: KIBITZ })
        }
      }
    },

    created() {
      if (this.$store.state.connected) {
        this.$store.state.send({ action: KIBITZ })
      }
    },

    beforeDestroy() {
      if (this.$store.state.connected) {
        this.$store.state.send({ action: LEAVE })
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
          transform: scale(0.6) translate(22.5%);
        }

        &:nth-of-type(4) {
          transform: scale(0.6) translate(-22.5%);
        }
      }

      &.small {
        &:nth-of-type(1) {
          transform: scale(0.3) translate(210%);
        }

        &:nth-of-type(5) {
          transform: scale(0.3) translate(-210%);
        }
      }
    }
  }
</style>
