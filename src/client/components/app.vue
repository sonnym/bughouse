<template>
  <v-app dark>
    <navigation v-bind:show="showNavigation"></navigation>

    <v-toolbar fixed>
      <v-btn flat x-large dark @click.stop="toggleNavigation">∞</v-btn>

      <controls></controls>

      <v-chip dark disabled>{{ activeUsers }} Online</v-chip>
    </v-toolbar>

    <main>
      <v-container fixed fluid>
        <router-view></router-view>
      </v-container>
    </main>

    <v-footer fixed>
      <div class="text-xs-center">
        &copy; 2011 <a href="https://github.com/sonnym">sonnym</a>
      </div>
    </v-footer>
  </v-app>
</template>

<script>
  import Navigation from "./navigation"
  import Controls from "./controls"

  export default {
    name: "Bughouse",

    computed: {
      showNavigation() {
        return this.$store.state.showNavigation
      },

      activeUsers() {
        return this.$store.state.universe.activeUsers
      }
    },

    methods: {
      toggleNavigation() {
        this.$store.commit("toggleNavigation")
      }
    },

    components: {
      navigation: Navigation,
      controls: Controls
    }
  }
</script>
