<template>
  <v-container fixed fluid>
    <div class="headline">{{ user.displayName }}</div>
  </v-container>
</template>

<script>
  export default {
    data() {
      return {
        user: { }
      }
    },

    beforeRouteEnter({ params }, _from, next) {
      fetch(`/users/${params.uuid}`)
        .then(response => response.json())
        .then(json => next(vm => vm.setUser(json)))
    },

    methods: {
      setUser(user) {
        this.user = user
      }
    },
  }
</script>
