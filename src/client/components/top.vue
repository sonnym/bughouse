<script>
  export default {
    name: "top"
  }
</script>

<template>
  <div id="top">
    <div id="kibitz" class="hidden">
     <a class="awesome blue large" onclick="bughouse.head()">&#x21ab;</a>
     <a class="awesome blue large" onclick="bughouse.prev()">&larr;</a>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
     <a class="awesome blue large" onclick="bughouse.next()">&rarr;</a>
     <a class="awesome blue large" onclick="bughouse.tail()">&#x21ac;</a>
    </div>

    <div id="play" class="hidden">
      <label>
        Show Moves
        <input type="checkbox" onchange="bughouse.toggleShowMoves(this.checked);" checked>
      </label>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <a class="awesome blue" onclick="bughouse.toggleFlipBoard();">Flip Boards</a>
      <a class="awesome blue" onclick="bughouse.redraw_boards();">Redraw Boards</a>
    </div>
  </div>
</template>
