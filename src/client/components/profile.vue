<template>
  <v-container fixed fluid>
    <v-flex tag="h1" class="headline">{{ user.displayName }}</v-flex>

    <v-spacer></v-spacer>
    <v-card>
      <v-card-title>
        Games
      </v-card-title>

      <v-spacer></v-spacer>

      <v-data-table
        :headers="headers"
        :items="games"
        :loading="loading"
        hide-actions
      >
        <template slot="items" slot-scope="props">
          <td>
            <router-link v-bind:to="{ name: 'user', params: { uuid: props.item.opponent.uuid } }">
              {{ props.item.opponent.displayName }}
            </router-link>
          </td>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
  import { map } from "ramda"

  export default {
    data() {
      return {
        loading: true,

        user: { },
        gamesData: [ ],

        headers: [
          { text: "Opponent", sortable: false },
          { text: "Result", sortable: false }
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
            opponent: gameDatum.whiteUser.uuid === this.user.uuid ? gameDatum.blackUser : gameDatum.whiteUser,
            result: "-"
          }
        }, this.gamesData)
      }
    },

    beforeRouteEnter({ params }, _from, next) {
      fetch(`/users/${params.uuid}`)
        .then(response => response.json())
        .then(json => next(vm => vm.setUser(json)))
    },

    created() {
      this.fetchGames()
    },

    methods: {
      setUser(user) {
        this.user = user
      },

      fetchGames() {
        fetch(`/users/${this.$route.params.uuid}/games`)
          .then(response => response.json())
          .then(json => {
            this.gamesData = json
            this.loading = false
          })
      },
    },

    watch: {
      "$route": "fetchGames"
    }
  }
</script>
