<template>
  <section id="controls">
    <div v-show="!playing">
      <v-btn outline>&#x21ab;</v-btn>
      <v-btn outline>&larr;</v-btn>

      <v-btn outline>&rarr;</v-btn>
      <v-btn outline>&#x21ac;</v-btn>
    </div>

    <div v-show="playing">
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
    data: function() {
      return {
        playing: false
      }
    }
  }
</script>
