<template>
  <v-app>
    <the-navigation :show="showNavigation" />
    <the-dialog />

    <the-header />

    <v-content app>
      <the-snackbar />

      <v-container
        fluid
        class="main"
      >
        <router-view />
      </v-container>
    </v-content>

    <the-footer />
  </v-app>
</template>

<script>
  import TheHeader from "./TheHeader"
  import TheFooter from "./TheFooter"

  import TheNavigation from "./TheNavigation"

  import TheDialog from "./TheDialog"
  import TheSnackbar from "./TheSnackbar"

  export default {
    name: "Bughouse",

    components: {
      TheHeader,
      TheFooter,

      TheNavigation,

      TheDialog,
      TheSnackbar
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

  .main {
    position: absolute;
    top: 0;
    bottom: 0;
  }
</style>
