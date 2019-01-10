<template>
  <div class="games">
    <board
      v-for="(position, index) in positions"
      v-bind:position="position"
      v-bind:key="index"
    ></board>
  </div>
</template>

<script>
  import Board from "./board"

  export default {
    computed: {
      positions() {
        return this.$store.state.positions
      }
    },

    components: {
      board: Board
    }
  }
</script>

<style lang="scss" scoped>
  .games {
    position: absolute;

    top: 0;
    bottom: 0;
    left: 0;
    right: 0;

    height: 100%;
    width: 100%;

    display: flex;
    flex-direction: row;
    justify-content: center;

    align-items: center;
  }
</style>

<style lang="scss">
  .games {
    .board:first-child, .board:last-child {
      width: 12vw;
      height: 12vw;

      .row {
        width: 12vw;
        height: 1.5vw;
      }

      .square {
        p {
          font-size: 1.5vw;
          line-height: 1.5vw;
        }
      }
    }

    .board:nth-child(2), .board:nth-child(4) {
      width: 24vw;
      height: 24vw;

      .row {
        width: 24vw;
        height: 3vw;
      }

      .square {
        p {
          font-size: 2.75vw;
          line-height: 3vw;
        }
      }
    }

    .board:nth-child(3) {
      width: 48vw;
      height: 48vw;

      .row {
        width: 48vw;
        height: 6vw;
      }

      .square {
        p {
          font-size: 5.5vw;
          line-height: 6vw;
        }
      }
    }
  }
</style>
