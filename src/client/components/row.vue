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
