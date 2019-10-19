<template>
  <v-app>
    <navigation v-bind:show="showNavigation"></navigation>

    <div class="bughouse">
      <bughouse-header></bughouse-header>

      <main>
        <router-view></router-view>
      </main>

      <bughouse-footer></bughouse-footer>
    </div>
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

  .bughouse {
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
