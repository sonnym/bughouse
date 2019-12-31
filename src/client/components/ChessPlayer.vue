<template>
  <v-chip v-if="user" disabled>
    <router-link v-bind:to="{ name: 'user', params: { uuid: user.uuid } }">{{ user.displayName }}</router-link>
  </v-chip>
</template>

<script>
  export default {
    name: "ChessPlayer",
    props: ["user"],
  }
</script>
