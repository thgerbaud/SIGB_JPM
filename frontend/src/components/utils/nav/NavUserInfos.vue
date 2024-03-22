<template>
    <div class="cursor-pointer">
        <span class="text-h6 hidden-sm-and-down">{{ user.name }}</span>
        <v-avatar :image="user.picture" size="40" class="ml-2"></v-avatar>
    </div>
</template>

<script setup>
defineProps(["user"]);
</script>