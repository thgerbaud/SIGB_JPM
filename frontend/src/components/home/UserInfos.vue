<template>
    <div class="text-center pa-2">
		<v-avatar :image="user.picture" size="65" referrerpolicy="no-referrer"></v-avatar>
        <!--<img id="user-picture" :src="user.picture" alt="User picture" referrerpolicy="no-referrer">-->
        <h5 class="text-h6 text-sm-h5 mt-2">Bienvenue, {{ user.name }}</h5>
    </div>
</template>

<script setup>
defineProps(["user"]);
</script>