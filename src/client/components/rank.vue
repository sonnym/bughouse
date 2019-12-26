<template>
  <div class="rank">
    <square
      v-for="(piece, index) in rank"
      v-bind:piece="piece"
      v-bind:key="index"
      v-bind:inverted="inverted"
    ></square>
  </div>
</template>

<script>
  import Square from "./square"

  export default {
    props: ["rank", "inverted"],

    components: {
      square: Square
    }
  }
</script>

<style lang="scss" scoped>
  .rank {
    width: 100%;
    height: 12.5%;

    display: flex;
    flex: 1;
    flex-direction: rank;
  }

  .rank:nth-of-type(even) {
    .square:nth-of-type(even), .square:nth-of-type(odd).inverted {
      background-color: #cd853f;
    }

    .square:nth-of-type(odd), .square:nth-of-type(even).inverted {
      background-color: #8b4513;
    }
  }

  .rank:nth-of-type(odd) {
    .square:nth-of-type(even), .square:nth-of-type(odd).inverted {
      background-color: #8b4513;
    }

    .square:nth-of-type(odd), .square:nth-of-type(even).inverted {
      background-color: #cd853f;
    }
  }
</style>
