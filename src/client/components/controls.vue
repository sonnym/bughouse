<template>
  <section class="controls">
    <div>
      <v-btn outline>&#x21ab;</v-btn>
      <v-btn @click="rotateLeft" outline>&larr;</v-btn>

      <v-btn @click="rotateRight" outline>&rarr;</v-btn>
      <v-btn outline>&#x21ac;</v-btn>
    </div>
  </section>
</template>

<script>
  export default {
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
