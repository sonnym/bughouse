<template>
  <v-app-bar app>
    <v-btn
      text
      x-large
      dark
      @click.stop="toggleNavigation"
    >
      <v-icon>mdi-infinity</v-icon>
    </v-btn>

    <v-spacer />
    <the-controls-kibitzing v-if="kibitzing" />
    <the-controls-playing v-if="playing" />
    <v-spacer />

    <v-chip disabled>
      {{ users }} Online
    </v-chip>
    <v-chip disabled>
      {{ games }} Games
    </v-chip>
  </v-app-bar>
</template>

<script>
  import TheControlsKibitzing from "./TheControlsKibitzing"
  import TheControlsPlaying from "./TheControlsPlaying"

  export default {
    name: "TheHeader",

    components: {
      TheControlsKibitzing,
      TheControlsPlaying
    },

    computed: {
      kibitzing() {
        return this.$route.path === "/" && !this.playing
      },

      playing() {
        return this.$store.getters["player/playing"]
      },

      users() {
        return this.$store.state.universe.users
      },

      games() {
        return this.$store.state.universe.games
      }
    },

    methods: {
      toggleNavigation() {
        this.$store.commit("toggleNavigation")
      }
    }
  }
</script>
