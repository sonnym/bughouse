<template>
  <v-container
    fixed
    fluid
  >
    <v-flex
      tag="h1"
      class="headline"
    >
      {{ user.displayName }}
    </v-flex>

    <v-spacer />

    <v-card>
      <v-card-title>
        Games
      </v-card-title>

      <v-spacer />

      <v-data-table
        :headers="headers"
        :items="games"
        :loading="loading"
        hide-default-footer
      >
        <template v-slot:item.opponent="{ item }">
          <router-link :to="{ name: 'user', params: { uuid: item.opponent.uuid } }">
            {{ item.opponent.displayName }}
          </router-link>
        </template>

        <template v-slot:item.result="{ item }">
          <router-link :to="{ name: 'game', params: { uuid: item.uuid } }">
            {{ item.result }}
          </router-link>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
  import { find, map } from "ramda"

  export default {
    name: "ViewProfile",

    data() {
      return {
        loading: true,

        user: { },
        gamesData: [ ],

        headers: [
          { text: "Opponent", value: "opponent", sortable: false },
          { text: "Result", value: "result", sortable: false }
        ]
      }
    },

    computed: {
      games() {
        if (!this.gamesData) {
          return [ ]
        }

        return map(gameDatum => {
          return {
            uuid: gameDatum.uuid,
            result: gameDatum.result,
            opponent: find(
              player => player.uuid !== this.user.uuid,
              gameDatum.players
            )
          }
        }, this.gamesData)
      }
    },

    beforeRouteEnter({ params }, _from, next) {
      window.fetch(`/users/${params.uuid}`)
        .then(response => response.json())
        .then(json => next(vm => vm.setUser(json)))
    },

    beforeRouteUpdate({ params }, _from, next) {
      this.loading = true
      this.user = null

      window.fetch(`/users/${params.uuid}`)
        .then(response => response.json())
        .then(json => {
          this.setUser(json)
          next()
        })
    },

    watch: {
      "$route": "fetchGames"
    },

    created() {
      this.fetchGames()
    },

    methods: {
      setUser(user) {
        this.user = user
      },

      fetchGames() {
        if (!this.$route.params.uuid) {
          return
        }

        window.fetch(`/users/${this.$route.params.uuid}/games`)
          .then(response => response.json())
          .then(json => {
            this.gamesData = json
            this.loading = false
          })
      },
    }
  }
</script>
