<template>
  <v-container fixed fluid>
    <h2>Sign Up</h2>

    <section>
      <form v-on:submit="submit">
        <input v-model="email" type="email" placeholder="email" required>
        <br>
        <input v-model="password" type="password" placeholder="password" required>
        <br>
        <input v-model="displayName" type="text" placeholder="displayName" required>
        <br>
        <input type="submit" value="Submit">
      </form>
    </section>
  </v-container>
</template>

<script>
  export default {
    name: "ViewSignup",

    data() {
      return {
        email: '',
        password: '',
        displayName: '',
      }
    },

    methods: {
      async submit() {
        const response = await fetch("/users", {
          method: "POST",
          body: JSON.stringify({
            email: this.email,
            password: this.password,
            displayName: this.displayName
          })
        })

        if (response.status === 201) {
          this.$store.commit("login", await response.json())
          this.$router.push("/")
        } else if (response.status === 400) { // eslint-disable-line no-empty
        }
      }
    }
  }
</script>
