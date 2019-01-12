<template>
  <section class="controls">
    <div v-show="!playing">
      <v-btn outline>&#x21ab;</v-btn>
      <v-btn @click="rotateLeft" outline>&larr;</v-btn>

      <v-btn @click="rotateRight" outline>&rarr;</v-btn>
      <v-btn outline>&#x21ac;</v-btn>
    </div>

    <div v-show="playing">
      <label>
        Show Moves
        <input checked>
      </label>

      <v-btn>Flip Boards</v-btn>
      <v-btn>Redraw Boards</v-btn>
    </div>
  </section>
</template>

<script>
  export default {
    data: function() {
      return {
        playing: false
      }
    },

    methods: {
      rotateLeft() {
        this.$store.commit("rotateLeft")
      },

      rotateRight() {
        this.$store.commit("rotateRight")
      }
    }
  }
</script>

<style lang="scss" scoped>
  .controls {
    margin: 0 auto;
  }
</style>
