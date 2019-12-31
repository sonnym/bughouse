<template>
  <section class="controls">
      <v-btn @click="rotateLeft" outlined>
        <v-icon>mdi-arrow-left-thick</v-icon>
      </v-btn>

      <v-btn @click="rotateRight" outlined>
        <v-icon>mdi-arrow-right-thick</v-icon>
      </v-btn>
  </section>
</template>

<script>
  export default {
    name: "TheControls",

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
