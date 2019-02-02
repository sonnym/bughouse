<template>
  <v-toolbar fixed>
    <v-btn flat x-large dark @click.stop="toggleNavigation">
      <v-icon>mdi-infinity</v-icon>
    </v-btn>

    <controls></controls>

    <v-chip dark disabled>{{ users }} Online</v-chip>
    <v-chip dark disabled>{{ games }} Games</v-chip>
  </v-toolbar>
</template>

<script>
  import Controls from "./controls"

  export default {
    name: "BughouseHeader",

    computed: {
      users() {
        return this.$store.state.universe.users
      },

      games() {
        return this.$store.state.universe.games
      }
    },

    components: {
      controls: Controls,
    }
  }
</script>
