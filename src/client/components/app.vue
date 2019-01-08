<template>
  <v-app dark>
    <navigation v-bind:drawer="drawer"></navigation>

    <v-toolbar fixed>
      <v-icon x-large @click.stop="drawer = !drawer">∞</v-icon>

      <controls></controls>
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

    data() {
      return {
        drawer: null,
      }
    },

    components: {
      navigation: Navigation,
      controls: Controls
    }
  }
</script>
