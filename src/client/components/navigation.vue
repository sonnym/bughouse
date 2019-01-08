<template>
  <v-navigation-drawer clipped temporary v-model="show">
    <v-list dense class="pt-0">
      <v-list-tile v-show="!loggedIn">
        <v-list-tile-action>
          <v-icon></v-icon>
        </v-list-tile-action>

        <v-list-tile-content>
          <router-link to="/login">Log In</router-link>
        </v-list-tile-content>
      </v-list-tile>

      <v-list-tile v-show="loggedIn">
        <v-list-tile-action>
          <v-icon></v-icon>
        </v-list-tile-action>

        <v-list-tile-content>
          <a v-on:click="logout" v-show="loggedIn">Log Out</a>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
  export default {
    props: ["drawer"],

    data: () => {
      return {
        show: () => this.drawer
      }
    },

    computed: {
      loggedIn() {
        return this.$store.state.loggedIn
      }
    },

    methods: {
      logout() {
        this.$store.commit("logOut")
        this.drawer = !this.drawer
      }
    }
  }
</script>
