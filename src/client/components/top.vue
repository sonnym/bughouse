<script>
  import Navigation from "./navigation"
  import Controls from "./controls"

  export default {
    name: "top",
    components: {
      navigation: Navigation,
      controls: Controls
    }
  }
</script>

<template>
  <header>
    <navigation></navigation>
    <controls></controls>
  </header>
</template>
