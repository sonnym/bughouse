<template>
  <v-chip
    v-if="user.displayName"
    disabled
  >
    <router-link :to="{ name: 'user', params: { uuid: user.uuid } }">
      {{ user.displayName }}
    </router-link>
  </v-chip>
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
