<template>
  <v-dialog v-model="show">
    <v-card>
      <v-card-title>
        Finding Opponent. . .
      </v-card-title>

      <v-card-text class="my-12">
        <v-progress-linear
          :height="8"
          indeterminate
          rounded
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: "TheDialog",

    computed: {
      show: {
        get() {
          return this.$store.getters["player/waiting"]
        },

        set() { }
      }
    }
  }
</script>
