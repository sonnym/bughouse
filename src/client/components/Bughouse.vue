<template>
  <v-app>
    <the-navigation v-bind:show="showNavigation" />

    <div id="bughouse">
      <the-header />

      <main>
        <router-view />
      </main>

      <the-footer />
    </div>
  </v-app>
</template>

<script>
  import TheHeader from "./TheHeader"
  import TheFooter from "./TheFooter"
  import TheNavigation from "./TheNavigation"

  export default {
    name: "Bughouse",

    computed: {
      showNavigation() {
        this.$store.state.showNavigation
      }
    },

    components: {
      TheHeader,
      TheFooter,
      TheNavigation
    }
  }
</script>

<style lang="scss">
  html, body {
    overflow: hidden;
  }

  #bughouse {
    position: fixed;
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
  }

  main {
    flex-grow: 1;
    overflow: hidden;
  }
</style>
