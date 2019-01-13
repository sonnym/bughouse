<template>
  <v-container fixed fluid>
    <h2>Sign Up</h2>

    <section>
      <form v-on:submit="submit">
        <input v-model="email" type="email" placeholder="email" required>
        <br>
        <input v-model="password" type="password" placeholder="password" required>
        <br>
        <input type="submit" value="Submit">
      </form>
    </section>
  </v-container>
</template>

<script>
  export default {
    data() {
      return {
        email: '',
        password: ''
      }
    },

    methods: {
      async submit() {
        const response = await fetch("/users", {
          method: "POST",
          body: JSON.stringify({
            email: this.email,
            password: this.password
          })
        })

        if (response.status === 201) {
          console.log("success")
        } else if (response.status === 400) {
          console.log("failure")
        }
      }
    }
  }
</script>
