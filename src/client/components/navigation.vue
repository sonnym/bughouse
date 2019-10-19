<template>
  <v-navigation-drawer temporary v-model="localShow">
    <v-toolbar>
      <v-toolbar-title>{{ displayName }}</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-list>
      <v-list-item>
        <v-list-item-icon>
          <v-icon>mdi-chess-king</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>
            <router-link to="/">Home</router-link>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-if="loggedOut">
        <v-list-item-icon>
          <v-icon>mdi-login-variant</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>
            <router-link to="/login">Log In</router-link>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-if="loggedOut">
        <v-list-item-icon>
          <v-icon>mdi-account-plus</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>
            <router-link to="/signup">Sign Up</router-link>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-if="loggedIn">
        <v-list-item-icon>
          <v-icon>mdi-account-circle</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>
            <router-link v-bind:to="{ name: 'user', params: { uuid } }">Profile</router-link>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider v-if="loggedIn"></v-divider>

      <v-list-item v-if="loggedIn">
        <v-list-item-icon>
          <v-icon>mdi-logout-variant</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>
            <a v-on:click="logout">Log Out</a>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
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
        return this.$store.state.user !== null
      },

      loggedOut() {
        return this.$store.state.user === null
      },

      displayName() {
        return this.loggedIn ? this.$store.state.user.displayName : "Bughouse"
      },

      uuid() {
        return this.loggedIn ? this.$store.state.user.uuid : null
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
        this.$store.dispatch("logout")
      }
    }
  }
</script>
