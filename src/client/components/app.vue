<script>
  import Top from "./top"
  import Games from "./games"
  import Bottom from "./bottom"

  export default {
    name: "app",
    components: {
      top: Top,
      games: Games,
      bottom: Bottom
    }
  }
</script>

<template>
  <section id="app">
    <header is="top"></header>
    <content is="games"></content>
    <footer is="bottom"></footer>
  </section>
</template>
