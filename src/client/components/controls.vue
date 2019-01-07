<template>
  <section id="controls">
    <div>
      <v-btn>&#x21ab;</v-btn>
      <v-btn>&larr;</v-btn>

      <v-btn>&rarr;</v-btn>
      <v-btn>&#x21ac;</v-btn>
    </div>

    <div v-if="playing">
      <label>
        Show Moves
        <input checked>
      </label>

      <v-btn>Flip Boards</v-btn>
      <v-btn>Redraw Boards</v-btn>
    </div>
  </section>
</template>

<script>
  export default {
    name: "controls",
    data: function() {
      return {
        playing: false
      }
    }
  }
</script>
