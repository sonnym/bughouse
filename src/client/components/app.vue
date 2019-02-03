<template>
  <v-app dark>
    <navigation v-bind:show="showNavigation"></navigation>

    <bughouse-header></bughouse-header>

    <main>
      <router-view></router-view>
    </main>

    <bughouse-footer></bughouse-footer>
  </v-app>
</template>

<script>
  import Header from "./header"
  import Footer from "./footer"
  import Navigation from "./navigation"

  export default {
    name: "Bughouse",

    computed: {
      showNavigation() {
        return this.$store.state.showNavigation
      },
    },

    components: {
      bughouseHeader: Header,
      bughouseFooter: Footer,
      navigation: Navigation
    }
  }
</script>

<style lang="scss">
  html, body {
    overflow: hidden;
  }
</style>

<style lang="scss" scoped>
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
