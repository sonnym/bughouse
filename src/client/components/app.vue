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
    <div is="top"></div>
    <div is="welcome"></div>
    <div is="games"></div>
    <div is="bottom"></div>
  </section>
</template>
