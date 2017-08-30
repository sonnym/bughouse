<script>
  export default {
    name: "top",
    data: {
      playing: false
    }
  }
</script>

<template>
  <header>
    <div id="kibitz">
     <a class="awesome blue large" onclick="bughouse.head()">&#x21ab;</a>
     <a class="awesome blue large" onclick="bughouse.prev()">&larr;</a>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
     <a class="awesome blue large" onclick="bughouse.next()">&rarr;</a>
     <a class="awesome blue large" onclick="bughouse.tail()">&#x21ac;</a>
    </div>

    <div id="play" v-if="playing">
      <label>
        Show Moves
        <input type="checkbox" onchange="bughouse.toggleShowMoves(this.checked);" checked>
      </label>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <a class="awesome blue" onclick="bughouse.toggleFlipBoard();">Flip Boards</a>
      <a class="awesome blue" onclick="bughouse.redraw_boards();">Redraw Boards</a>
    </div>
  </header>
</template>
