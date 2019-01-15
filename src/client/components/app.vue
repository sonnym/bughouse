<template>
  <v-app dark>
    <navigation v-bind:show="showNavigation"></navigation>

    <v-toolbar fixed>
      <v-btn flat x-large dark @click.stop="toggleNavigation">
        <v-icon>mdi-infinity</v-icon>
      </v-btn>

      <controls></controls>

      <v-chip dark disabled>{{ activeUsers }} Online</v-chip>
    </v-toolbar>

    <main>
      <router-view></router-view>
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

<style lang="scss">
  html, body {
    overflow: hidden;
  }
</style>

<style lang="scss" scoped>
  section#controls {
    margin: 0 auto;
  }

  footer div {
    width: 100%;
  }

  main {
    position: fixed;

    top: 64px;
    bottom: 36px;

    width: 100%;

    > div {
      position: absolute;
      top: 64px;
      bottom: 36px;
      left: 0;
      right: 0;
    }
  }
</style>
