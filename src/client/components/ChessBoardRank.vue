<template>
  <div class="rank">
    <chess-board-square
      v-for="piece in squares"
      :key="piece.coords"
      :piece="piece"
    />
  </div>
</template>

<script>
  import ChessBoardSquare from "./ChessBoardSquare"

  export default {
    name: "ChessBoardRank",

    components: {
      ChessBoardSquare
    },

    props: {
      squares: {
        type: Array,
        default: () => ([])
      }
    }
  }
</script>

<style lang="scss" scoped>
  .rank {
    width: 100%;

    height: 12.5%;
    max-height: 12.5%;

    display: flex;
    flex: 1;
    flex-direction: rank;
  }

  .rank:nth-of-type(even) {
    .square:nth-of-type(even) {
      background-color: #cd853f;
    }

    .square:nth-of-type(odd) {
      background-color: #8b4513;
    }
  }

  .rank:nth-of-type(odd) {
    .square:nth-of-type(even) {
      background-color: #8b4513;
    }

    .square:nth-of-type(odd) {
      background-color: #cd853f;
    }
  }
</style>
