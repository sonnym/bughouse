<template>
  <v-row class="py-2 mx-1 reserve">
    <v-badge
      v-for="(count, piece) in utf8reserve"
      :key="piece"
      :content="count"
      class="pt-2"
      color="grey darken-4"
      offset-x="20"
      offset-y="20"
      overlap
      bordered
    >
      <v-avatar
        class="mx-2"
        color="grey darken-2"
      >
        <span :class="['display-1', colorClass]">{{ piece }}</span>
      </v-avatar>
    </v-badge>

    <v-spacer />

    <v-icon
      v-if="turn"
      class="red--text text--darken-4"
    >
      mdi-circle
    </v-icon>
  </v-row>
</template>

<script>
  import {
    WHITE,
    PAWN,
    ROOK,
    KNIGHT,
    BISHOP,
    QUEEN,
  } from "~/share/constants/chess"

  export default {
    name: "ChessReserve",

    props: {
      color: {
        type: String,
        default: ""
      },

      reserve: {
        type: Object,
        default: () => ({})
      },

      turn: Boolean
    },

    computed: {
      colorClass() {
        return this.color === WHITE ? "white--text" : "black--text"
      },

      utf8reserve() {
        return Object.keys(this.reserve).reduce((memo, key) => {
          memo[utf8piece(key)] = this.reserve[key].toString()

          return memo
        }, {})
      }
    }
  }

  function utf8piece(piece) {
    switch (piece) {
      case PAWN: return "♟"
      case KNIGHT: return "♞"
      case BISHOP: return "♝"
      case ROOK: return "♜"
      case QUEEN: return "♛"
    }
  }
</script>

<style lang="scss" scoped>
  .reserve {
    user-select: none;
  }
</style>
