<template>
  <v-row
    v-if="user && user.uuid"
    class="py-2 mx-2"
  >
    <router-link :to="{ name: 'user', params: { uuid: user.uuid } }">
      {{ user.displayName || " " }}
    </router-link>
  </v-row>
</template>

<script>

  export default {
    name: "ChessPlayer",

    props: {
      user: {
        type: Object,
        default: () => ({})
      }
    }
  }
</script>
