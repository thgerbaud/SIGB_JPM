<template>
    <h5 class="text-h5 mt-4">{{ title }}</h5>
    <v-divider class="mb-4"></v-divider>
    <div class="mb-8">
        <slot name="content"></slot>
        <slot name="actions"></slot>
    </div>
</template>

<script setup>
defineProps(["title"]);
</script>