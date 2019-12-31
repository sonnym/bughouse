<template>
  <v-app>
    <the-navigation :show="showNavigation" />

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

    components: {
      TheHeader,
      TheFooter,
      TheNavigation
    },

    computed: {
      showNavigation() {
        return this.$store.state.showNavigation
      }
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
