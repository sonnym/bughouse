<template>
  <v-row class="py-2 mx-1 reserve">
    <v-badge
      v-for="{ piece, count } in countedPieces"
      :key="piece.type"
      :content="count"
      class="pt-2"
      color="grey darken-4"
      offset-x="20"
      offset-y="20"
      overlap
      bordered
    >
      <v-avatar
        class="mx-2 pt-4 text-center display-1"
        color="grey darken-2"
      >
        <chess-piece
          :class="colorClass"
          :piece="piece"
          @dragging="dragging"
        />
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
  import { map, toPairs } from "ramda"

  import { WHITE } from "~/share/constants/chess"

  import ChessPiece from "./ChessPiece.vue"

  export default {
    name: "ChessReserve",

    components: {
      ChessPiece
    },

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

      countedPieces() {
        return map(
          ([type, count]) => ({
            piece: {
              type,
              coords: "RESERVE"
            },
            count: count.toString(),
          }),
          toPairs(this.reserve)
        )
      }
    },

    methods: {
      dragging(...args) {
        this.$emit("dragging", ...args)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .reserve {
    user-select: none;

    .piece {
      font-size: 110%;
    }
  }
</style>
