<template>
  <v-navigation-drawer temporary v-model="localShow">
    <v-toolbar>
      <v-toolbar-title>{{ displayName }}</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-list v-show="loggedOut">
      <v-list-tile>
        <v-list-tile-action>
          <login-variant-icon />
        </v-list-tile-action>

        <v-list-tile-content>
          <v-list-tile-title>
            <router-link to="/login">Log In</router-link>
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>

    <v-list v-show="loggedIn">
      <v-list-tile>
        <v-list-tile-action>
          <account-circle-icon />
        </v-list-tile-action>

        <v-list-tile-content>
          <v-list-tile-title>
            <a>Profile</a>
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>

      <v-divider></v-divider>

      <v-list-tile>
        <v-list-tile-action>
          <logout-variant-icon />
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
  import AccountCircleIcon from "vue-material-design-icons/AccountCircle.vue"
  import LoginVariantIcon from "vue-material-design-icons/LoginVariant.vue"
  import LogoutVariantIcon from "vue-material-design-icons/LogoutVariant.vue"

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
    },

    components: {
      AccountCircleIcon,
      LoginVariantIcon,
      LogoutVariantIcon
    }
  }
</script>
