<template>
  <section class="mx-auto my-0 align-center">
    <v-btn
      outlined
      @click="rotateLeft"
    >
      <v-icon>mdi-arrow-left-thick</v-icon>
    </v-btn>

    <v-btn
      outlined
      @click="rotateRight"
    >
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
