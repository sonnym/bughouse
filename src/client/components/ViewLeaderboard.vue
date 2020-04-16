<template>
  <v-card
    class="mx-2 mt-5 px-3"
    tile
  >
    <v-card-title>
      <h2>Leaderboard</h2>
    </v-card-title>

    <v-card-text>
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
    </v-card-text>
  </v-card>
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

    watch: {
      "$route": "fetchUsers"
    },

    created() {
      this.fetchUsers()
    },

    methods: {
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
