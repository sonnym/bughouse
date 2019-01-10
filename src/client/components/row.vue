<template>
  <div class="row">
    <square
      v-for="(piece, index) in row"
      v-bind:piece="piece"
      v-bind:key="index"
    ></square>
  </div>
</template>

<script>
  import Square from "./square"

  export default {
    props: ["row"],

    components: {
      square: Square
    }
  }
</script>

<style lang="scss" scoped>
  .row {
    display: flex;
    flex: 1;
    flex-direction: row;
  }
</style>

<style lang="scss">
  .row:nth-of-type(even) {
    .square:nth-of-type(even) {
      background-color: #cd853f;
    }

    .square:nth-of-type(odd) {
      background-color: #8b4513;
    }
  }

  .row:nth-of-type(odd) {
    .square:nth-of-type(even) {
      background-color: #8b4513;
    }

    .square:nth-of-type(odd) {
      background-color: #cd853f;
    }
  }
</style>
