<template>
  <v-container fixed fluid>
    <h2>Login</h2>

    <section>
      <form v-on:submit.prevent="submit">
        <input v-model="email" type="email" placeholder="email" required>
        <br>
        <input v-model="password" type="password" placeholder="password" required> <br>
        <input type="submit" value="Submit">
      </form>
    </section>

    <p>
      Not registered?
      <router-link to="/signup">Sign up!</router-link>
    </p>
  </v-container>
</template>

<script>
  export default {
    name: "ViewLogin",

    data() {
      return {
        email: '',
        password: ''
      }
    },

    methods: {
      async submit() {
        const response = await fetch("/sessions", {
          method: "POST",
          body: JSON.stringify({
            email: this.email,
            password: this.password
          })
        })

        if (response.status === 201) {
          this.$store.commit("logIn", await response.json())
          this.$router.push("/")
        } else if (response.status === 401) { // eslint-disable-line no-empty
        }
      }
    }
  }
</script>
