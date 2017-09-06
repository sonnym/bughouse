<script>
  import Top from "./top"
  import Bottom from "./bottom"

  export default {
    name: "app",
    components: {
      top: Top,
      bottom: Bottom
    }
  }
</script>

<template>
  <section id="app">
    <header is="top"></header>
    <router-view></router-view>
    <footer is="bottom"></footer>
  </section>
</template>
