<template>
    <div class="text-center">
		<v-avatar :image="user.picture" size="65" referrerpolicy="no-referrer"></v-avatar>
        <!--<img id="user-picture" :src="user.picture" alt="User picture" referrerpolicy="no-referrer">-->
        <h2 class="text-h5 mt-2">Bienvenue, {{ user.name }}</h2>
    </div>
</template>

<script setup>
defineProps(["user"]);
</script>