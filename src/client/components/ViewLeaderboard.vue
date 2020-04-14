<template>
  <v-container
    fixed
    fluid
  >
    <v-flex
      tag="h1"
      class="headline"
    >
      Leaderboard
    </v-flex>

    <v-spacer />

    <v-card>
      <v-data-table
        :headers="headers"
        :items="users"
        :loading="loading"
        hide-default-footer
      >
        <template v-slot:item.name="{ item }">
          <router-link :to="{ name: 'user', params: { uuid: item.uuid } }">
            {{ item.displayName }}
          </router-link>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
  export default {
    name: "ViewLeaderboard",

    data() {
      return {
        loading: true,

        users: [ ],

        headers: [
          { text: "Name", value: "name", sortable: false },
          { text: "Rating", value: "rating", sortable: false }
        ]
      }
    },

    beforeRouteEnter({ params }, _from, next) {
      fetch("/users")
        .then(response => response.json())
        .then(json => next(vm => vm.setUsers(json)))
    },

    beforeRouteUpdate({ params }, _from, next) {
      this.loading = true
      this.user = null

      fetch("/users")
        .then(response => response.json())
        .then(json => {
          this.setUsers(json)
          next()
        })
    },

    watch: {
      "$route": "fetchUsers"
    },

    created() {
      this.fetchUsers()
    },

    methods: {
      setUsers(users) {
        this.users = users
      },

      fetchUsers() {
        this.$store.state.fetch("/users")
          .then(response => response.json())
          .then(json => {
            this.users = json
            this.loading = false
          })
      },
    }
  }
</script>
