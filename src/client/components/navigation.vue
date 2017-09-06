<script>
  export default {
    name: "navigation",
    data: function() {
      return {
        loggedIn: false
      }
    }
  }
</script>

<template>
  <nav>
    <h1>∞</h1>

    <ul v-if="!loggedIn">
      <li><router-link to="/login">Log In</router-link></li>
    </ul>

    <ul v-if="loggedIn">
      <li><router-link to="/profile">Profile</router-link></li>
      <li><router-link to="/logout">Log Out</router-link></li>
    </ul>
  </nav>
</template>
