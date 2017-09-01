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
      <li><a href="">Log In</a></li>
    </ul>

    <ul v-if="loggedIn">
      <li><a href="">Profile</a></li>
      <li><a href="">Log Out</a></li>
    </ul>
  </nav>
</template>
