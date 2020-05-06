<template>
  <v-sheet :class="['px-4', 'd-flex', directionClass]">
    <v-row
      v-if="user && user.uuid"
      class="py-2 mx-2"
    >
      <router-link :to="{ name: 'user', params: { uuid: user.uuid } }">
        {{ user.displayName || " " }}
      </router-link>
    </v-row>

    <v-row class="py-2 mx-1">
      <v-badge
        v-for="(count, piece) in utf8reserve"
        :key="piece"
        :content="count"
        :top="top"
        :bottom="bottom"
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
  </v-sheet>
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
    name: "ChessPlayer",

    props: {
      context: {
        type: String,
        default: ""
      },

      user: {
        type: Object,
        default: () => ({})
      },

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
      directionClass() {
        return this.context === "top" ? "flex-column" : "flex-column-reverse"
      },

      top() {
        return this.context === "top"
      },

      bottom() {
        return this.context == "bottom"
      },

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
