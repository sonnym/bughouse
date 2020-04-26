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
              :game="fullGame"
            />
          </v-col>

          <v-col>
            <v-data-table
              :headers="headers"
              :items="revisions"
              :items-per-page="Infinity"
              :loading="loading"
              dense
              disable-sort
              disable-default-footer
            >
              <template v-slot:item="{ index, item }">
                <tr>
                  <td>{{ index + 1 }}</td>

                  <td>
                    <a @click="setCurrentRevision(item.w)">
                      {{ item.w ? item.w.move : "" }}
                    </a>
                  </td>

                  <td>
                    <a @click="setCurrentRevision(item.b)">
                      {{ item.b ? item.b.move : "" }}
                    </a>
                  </td>
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

  import { filter, find, includes, map, splitEvery } from "ramda"

  import { MOVE, DROP } from "~/share/constants/revision_types"
  import { STARTING_POSITION, WHITE, BLACK } from "~/share/constants/chess"

  import ChessGame from "./ChessGame"

  export default {
    name: "ViewHistory",

    components: {
      ChessGame
    },

    data() {
      return {
        loading: true,

        game: null,
        currentRevision: null,

        headers: [
          { text: "#" },
          { text: "White" },
          { text: "Black" }
        ]
      }
    },

    computed: {
      fullGame() {
        const currentPosition = {
          fen: this.currentRevision ? this.currentRevision.fen : STARTING_POSITION,
          reserves: { [WHITE]: {}, [BLACK]: {} }
        }

        return { ...this.game, currentPosition }
      },

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
        }, splitEvery(2, filter(revision => {
          return includes(revision.type, [MOVE, DROP])
        }, this.game.revisions)))
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
          .then(({ data }) => {
            this.game = data.getGame
            this.loading = false
          })
      },

      setCurrentRevision(revision) {
        this.currentRevision = revision
      }
    }
  }
</script>
