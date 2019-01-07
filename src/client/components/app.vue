<template>
  <v-app dark>
    <v-navigation-drawer clipped temporary v-model="drawer">
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

    <v-toolbar fixed>
      <v-icon x-large @click.stop="drawer = !drawer">∞</v-icon>

      <!--<controls></controls>-->
    </v-toolbar>

    <main>
      <v-container fixed fluid>
        <router-view></router-view>
      </v-container>
    </main>

    <v-footer fixed>
      <div class="text-xs-center">
        &copy; 2011 <a href="https://github.com/sonnym">sonnym</a>
      </div>
    </v-footer>
  </v-app>
</template>

<script>
  import Controls from "./controls"

  export default {
    name: "Bughouse",

    data() {
      return {
        drawer: null,
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
    },

    components: {
      controls: Controls
    }
  }
</script>
