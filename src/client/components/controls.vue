<template>
  <section class="controls">
    <div>
      <v-btn outlined>&#x21ab;</v-btn>
      <v-btn @click="rotateLeft" outlined>&larr;</v-btn>

      <v-btn @click="rotateRight" outlined>&rarr;</v-btn>
      <v-btn outlined>&#x21ac;</v-btn>
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
