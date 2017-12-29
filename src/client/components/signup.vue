<script>
  export default {
    name: "signup"
  }
</script>

<template>
  <content>
    <h2>Sign Up</h2>

    <section>
      <form action="/users" method="post">
        <input type="email" placeholder="email" required>
        <br>
        <input type="password" placeholder="password" required>
        <br>
        <button>Submit</button>
      </form>
    </section>
  </content>
</template>
