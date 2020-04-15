<template>
  <v-card
    class="mx-2 mt-5 px-3"
    tile
  >
    <v-card-title tag="h2">
      <h2>Login</h2>
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

        <v-btn type="submit">
          Submit
        </v-btn>
      </v-form>
    </v-card-text>

    <v-divider />

    <v-card-actions>
      Not registered?

      <v-btn
        text
        color="primary"
        class="ml-1"
        @click="signup"
      >
        Sign up!
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  import { SUCCESS, ERROR } from "~/share/constants/message"

  export default {
    name: "ViewLogin",

    data() {
      return {
        email: '',
        password: ''
      }
    },

    methods: {
      signup() {
        this.$router.push("/signup")
      },

      async submit() {
        const response = await this.$store.state.fetch("/sessions", {
          method: "POST",

          body: JSON.stringify({
            email: this.email,
            password: this.password
          })
        })

        if (response.status === 201) {
          this.$store.commit("message", {
            type: SUCCESS,
            text: "Successfully logged in!"
          })

          const user = await response.json()

          this.$store.commit("login", user)
          this.$router.push("/")

        } else if (response.status === 401) {
          this.$store.commit("message", {
            type: ERROR,
            text: "Invalid email or password. Please try again."
          })

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
