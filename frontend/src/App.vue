<template>
  <div id="app">
    <!--
    <nav class="navbar navbar-expand navbar-dark bg-dark">
      <router-link to="/books" class="navbar-brand">Ma bibliothèque</router-link>
    </nav>
  -->
    <div class="container mt-3">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: "app"
};
</script>