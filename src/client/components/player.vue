<template>
  <v-chip disabled>
    {{ user.displayName }}
  </v-chip>
</template>

<script>
  export default {
    props: ["user"],
  }
</script>
