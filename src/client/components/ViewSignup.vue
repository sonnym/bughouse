<template>
  <v-card
    class="mx-2 mt-5 px-3"
    tile
  >
    <v-card-title>
      <h2>Sign Up</h2>
    </v-card-title>

    <v-card-text>
      <v-form @submit.prevent="submit">
        <v-text-field
          v-model="email"
          type="email"
          label="Email"
          required
        />

        <v-text-field
          v-model="password"
          type="password"
          label="Password"
          required
        />

        <v-text-field
          v-model="displayName"
          label="Display Name"
          :counter="40"
          required
        />

        <v-btn type="submit">
          Submit
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
  import { SUCCESS, ERROR } from "~/share/constants/message"

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
        const response = await this.$store.state.fetch("/users", {
          method: "POST",
          body: JSON.stringify({
            email: this.email,
            password: this.password,
            displayName: this.displayName
          })
        })

        if (response.status === 201) {
          this.$store.commit("message", {
            type: SUCCESS,
            text: "Account successfully created!"
          })

          const user = await response.json()

          this.$store.commit("login", user)
          this.$router.push("/")

        } else {
          this.$store.commit("message", {
            type: ERROR,
            text: "Something went wrong. Please try again."
          })
        }
      }
    }
  }
</script>
