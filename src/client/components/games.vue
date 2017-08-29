<script>
  export default {
    name: "games"
  }
</script>

<template>
  <div id="games">
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

    <div id="promotion" class="hidden"></div>

    <div id="hold" class="hidden">
      <br><br>
      Waiting for an opponent.
      <br>
      <br>
      Please be patient.
    </div>
  </div>
</template>
