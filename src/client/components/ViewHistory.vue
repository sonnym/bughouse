<template>
  <v-card
    class="mx-2 mt-5 px-3"
    tile
  >
    <v-card-title>
      {{ title }}
    </v-card-title>

    <v-card-text>
      <v-container>
        <v-row>
          <v-col>
            <chess-game
              v-if="game"
              :game="game"
            />
          </v-col>

          <v-col>
            <v-data-table
              :headers="headers"
              :items="revisions"
              hide-default-footer
            >
              <template v-slot:item="{ index, item }">
                <tr>
                  <td>{{ index + 1 }}</td>
                  <td>{{ item.w.move }}</td>
                  <td>{{ item.b.move }}</td>
                </tr>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
  import { gql } from "@apollo/client"

  import { drop, find, map, splitEvery } from "ramda"

  import { WHITE, BLACK } from "~/share/constants/chess"

  import ChessGame from "./ChessGame"

  export default {
    name: "ViewHistory",

    components: {
      ChessGame
    },

    data() {
      return {
        game: null,

        headers: [
          { text: "#", sortable: false },
          { text: "White", sortable: false },
          { text: "Black", sortable: false }
        ]
      }
    },

    computed: {
      whitePlayer() {
        if (!this.game) {
          return
        }

        return find(player => player.color === WHITE, this.game.players)
      },

      blackPlayer() {
        if (!this.game) {
          return
        }

        return find(player => player.color === BLACK, this.game.players)
      },

      title() {
        if (!this.game) {
          return ""
        }

        const whitePlayer = this.whitePlayer
        const blackPlayer = this.blackPlayer

        return [
          whitePlayer.user.displayName,
          `(${whitePlayer.user.rating})`,
          " vs ",
          blackPlayer.user.displayName,
          `(${blackPlayer.user.rating})`
        ].join(" ")
      },

      revisions() {
        if (!this.game) {
          return []
        }

        return map(([white, black]) => {
          return {
            [WHITE]: white,
            [BLACK]: black
          }
        }, splitEvery(2, drop(1, this.game.revisions)))
      }
    },

    created() {
      this.getGame(this.$route.params.uuid)
    },

    methods: {
      getGame(uuid) {
        const query = gql`
          {
            getGame(uuid: "${uuid}") {
              players {
                color
                user {
                  uuid
                  displayName
                  rating
                }
              }

              revisions {
                type
                fen
                move
              }
            }
          }
        `

        this.$store.state.query({ query })
          .then(({ data }) => this.game = data.getGame )
      }
    }
  }
</script>
