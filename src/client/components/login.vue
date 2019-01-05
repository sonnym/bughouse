<template>
  <content>
    <h2>Login</h2>

    <section>
      <form action="/sessions" method="post" enctype="application/x-www-url-formencoded">
        <input name="email" type="email" placeholder="email" required>
        <br>
        <input name="password" type="password" placeholder="password" required>
        <br>
        <button>Submit</button>
      </form>
    </section>

    <p>
      Not registered?
      <router-link to="/signup">Sign up!</router-link>
    </p>
  </content>
</template>

<script>
  export default {
    name: "login"
  }
</script>
