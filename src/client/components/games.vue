<script>
  export default {
    name: "games"
  }
</script>

<template>
  <div id="games">
    <div id="l">
      <div class="meta top hidden"></div>
      <div class="board"></div>
      <div class="meta bottom hidden"></div>
    </div>

    <div id="c">
      <div class="meta top hidden"></div>
      <div class="board"></div>
      <div class="meta bottom hidden"></div>
    </div>

    <div id="r">
      <div class="meta top hidden"></div>
      <div class="board"></div>
      <div class="meta bottom hidden"></div>
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
