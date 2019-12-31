<template>
  <v-footer class="text-center" padless>
    <v-card text tile>
      <v-card-text class="white--text">
        &copy; {{ new Date().getFullYear() }} <a href="https://sonnym.github.io/">Sonny Michaud</a>
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script>
  export default {
    name: "BughouseFooter"
  }
</script>

<style lang="scss" scoped>
  footer div {
    width: 100%;
  }
</style>
