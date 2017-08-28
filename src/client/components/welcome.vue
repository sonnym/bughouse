<script>
  export default {
    name: "welcome"
  }
</script>

<template>
  <div id="welcome">
    <h2>Welcome to Infinite Bughouse</h2>
    <h3>Instructions</h3>
    <p>
      Bughouse is a chess variant normally played with four people on two boards.
    </p>
    <p>
      This implementation of bughouse differs in one important way - your game is but one in a massive loop of games: pieces you take travel to the right; you get pieces from the left.
    </p>
    <p>
      To start playing, simply enter your name below and press play!
    </p>
    <p><label>Name <input type="text" id="name"></label></p>
    <p>
      <a class="awesome blue bold" href="#" onclick="bughouse.play()">Play</a>
      <a class="awesome blue bold" href="#" onclick="bughouse.kibitz()">Kibitz</a>
    </p>
  </div>
</template>
