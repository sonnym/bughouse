<template>
  <v-snackbar
    v-model="show"
    :top="true"
    :timeout="5000"
    :absolute="true"
    :color="color"
  >
    <v-icon v-if="error">
      mdi-alert-circle-outline
    </v-icon>

    <v-icon v-if="success">
      mdi-check-circle-outline
    </v-icon>

    {{ message }}

    <v-icon
      small
      @click="show = false"
    >
      mdi-close-circle-outline
    </v-icon>
  </v-snackbar>
</template>

<script>
  import { SUCCESS, ERROR } from "~/share/constants/message"

  export default {
    name: "TheSnackbar",

    computed: {
      show: {
        get: function() {
          return this.$store.state.message.show
        },

        set: function(newValue) {
          this.$store.commit("message", {
            ...this.$store.state.message,
            show: false
          })
        }
      },

      error() {
        return this.type === ERROR
      },

      success() {
        return this.type === SUCCESS
      },

      color() {
        switch (this.type) {
          case SUCCESS: return "green darken-2"
          case ERROR: return "red darken-2"
          default: return "primary"
        }
      },

      message() {
        return this.$store.state.message.text
      },

      type() {
        return this.$store.state.message.type
      }
    }
  }
</script>
