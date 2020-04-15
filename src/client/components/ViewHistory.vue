<template>
  <v-card
    class="mx-2 mt-5 px-3"
    tile
  >
    <v-card-title>
      {{ message }}
    </v-card-title>

    <v-card-text>
      <v-container>
        <v-row>
          <v-col>
            <chess-game />
          </v-col>

          <v-col>
            <v-data-table
              :headers="headers"
              :items="moves"
              hide-default-footer
            />
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
  import { gql } from "@apollo/client"

  import ChessGame from "./ChessGame"

  export default {
    name: "ViewHistory",

    components: {
      ChessGame
    },

    data() {
      return {
        message: "",

        moves: [ ],

        headers: [
          { text: "#", sortable: false },
          { text: "White", sortable: false },
          { text: "Black", sortable: false }
        ]
      }
    },

    created() {
      this.fetchMessage()
    },

    methods: {
      fetchMessage() {
        const query = gql`
          {
            hello
          }
        `

        this.$store.state.query({ query })
          .then(({ data }) => this.message = data )
      }
    }
  }
</script>
