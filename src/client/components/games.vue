<script>
  export default {
    name: "games",
    data: {
      holding: false
    }
  }
</script>

<template>
  <content>
    <section id="games">
      <div id="before">
        <div class="meta top"></div>
        <div class="board"></div>
        <div class="meta bottom"></div>
      </div>

      <div id="center">
        <div class="meta top"></div>
        <div class="board"></div>
        <div class="meta bottom"></div>
      </div>

      <div id="after">
        <div class="meta top"></div>
        <div class="board"></div>
        <div class="meta bottom"></div>
      </div>

      <div id="promotion"></div>

      <div id="hold" v-if="holding">
        <br><br>
        Waiting for an opponent.
        <br>
        <br>
        Please be patient.
      </div>
    </section>
  </content>
</template>
