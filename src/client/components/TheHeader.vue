<template>
  <header>
    <v-toolbar>
      <v-btn
        text
        x-large
        dark
        @click.stop="toggleNavigation"
      >
        <v-icon>mdi-infinity</v-icon>
      </v-btn>

      <v-spacer />
      <the-controls v-if="kibitzing" />
      <v-spacer />

      <v-chip disabled>
        {{ users }} Online
      </v-chip>
      <v-chip disabled>
        {{ games }} Games
      </v-chip>
    </v-toolbar>
  </header>
</template>

<script>
  import TheControls from "./TheControls"

  export default {
    name: "TheHeader",

    components: {
      TheControls
    },

    computed: {
      kibitzing() {
        return this.$route.path === "/"
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
