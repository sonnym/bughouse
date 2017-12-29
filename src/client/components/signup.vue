<script>
  export default {
    name: "signup"
  }
</script>

<template>
  <content>
    <h2>Sign Up</h2>

    <section>
      <form action="/users" method="post" enctype="application/x-www-url-formencoded">
        <input name="email" type="email" placeholder="email" required>
        <br>
        <input name="password" type="password" placeholder="password" required>
        <br>
        <button>Submit</button>
      </form>
    </section>
  </content>
</template>
