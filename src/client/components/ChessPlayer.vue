<template>
  <div>
    <v-chip v-if="user.displayName">
      <router-link :to="{ name: 'user', params: { uuid: user.uuid } }">
        {{ user.displayName }}
      </router-link>
    </v-chip>

    <v-icon v-if="turn">
      mdi-circle
    </v-icon>
  </div>
</template>

<script>
  export default {
    name: "ChessPlayer",

    props: {
      user: {
        type: Object,
        default: () => ({})
      },

      turn: Boolean
    }
  }
</script>
