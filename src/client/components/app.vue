<script>
  import Controls from "./controls"

  export default {
    name: "app",

    data() {
      return {
        drawer: null,
        loggedIn: false,
        links: function() {
          this.loggedIn ? [
            { to: "/login", title: "Log In" }
          ] : [
            { to: "/logout", title: "Log Out" }
          ]
        }
      }
    },

    components: {
      controls: Controls
    }
  }
</script>

<template>
  <v-app dark>
    <v-navigation-drawer temporary v-model="drawer" absolute>
      <v-list dense>
        <v-divider light></v-divider>
        <v-list-tile v-for="link in links()" :key="link.title">
          <v-list-tile-action>
            <v-icon></v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <router-link to="link.to">{{ link.title }}</router-link></li>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar fixed>
      <v-icon x-large @click.stop="drawer = !drawer">∞</v-icon large>

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
