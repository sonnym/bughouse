<template>
  <div>{{ message }}</div>
</template>

<script>
  import { gql } from "@apollo/client"

  export default {
    name: "ViewHistory",

    data() {
      return {
        message: ""
      }
    },

    created() {
      this.fetchMessage()
    },

    methods: {
      fetchMessage() {
        const query = gql`
          {
            hello
          }
        `

        this.$store.state.query({ query })
          .then(({ data }) => this.message = data )
      }
    }
  }
</script>
