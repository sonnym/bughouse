<template>
  <v-navigation-drawer temporary v-model="localShow">
    <v-toolbar>
      <v-toolbar-title>Bughouse</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-list dense v-show="loggedOut">
      <v-list-tile>
        <v-list-tile-action>
          <v-icon>verified_user</v-icon>
        </v-list-tile-action>

        <v-list-tile-content>
          <v-list-tile-title>
            <router-link to="/login">Log In</router-link>
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>

    <v-list dense v-show="loggedIn">
      <v-list-tile>
        <v-list-tile-action>
          <v-icon>exit_to_app</v-icon>
        </v-list-tile-action>

        <v-list-tile-content>
          <v-list-tile-title>
            <a v-on:click="logout">Log Out</a>
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
  export default {
    props: {
      show: { type: Boolean }
    },

    data: function() {
      return {
        localShow: this.show
      }
    },

    computed: {
      loggedIn() {
        return this.$store.state.loggedIn
      },

      loggedOut() {
        return !this.$store.state.loggedIn
      }
    },

    watch: {
      show: function(value) {
        this.localShow = value
      },

      localShow: function(value) {
        if (!value) {
          this.$store.commit("hideNavigation")
        }
      }
    },

    methods: {
      logout() {
        this.$store.commit("logOut")
        this.$store.commit("hideNavigation")
      }
    }
  }
</script>
