<template>
  <section class="mx-auto my-0 align-center">
    <v-btn
      outlined
      @click="play"
    >
      Play Now
    </v-btn>

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

    <v-switch
      v-model="flip"
      color="primary darken"
      class="float-right ml-4 mt-1"
      label="Flip Boards"
      hide-details
    />
  </section>
</template>

<script>
  import { mapActions } from "vuex"

  export default {
    name: "TheControlsKibitzing",

    computed: {
      flip: {
        get() {
          return this.$store.flip
        },

        set() {
          this.$store.commit("flip")
        }
      }
    },

    methods: {
      play() {
        this.$store.dispatch("player/play")
      },

      ...mapActions(["rotateLeft", "rotateRight"])
    },
  }
</script>
