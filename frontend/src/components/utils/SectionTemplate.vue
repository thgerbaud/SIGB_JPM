
<template>
    <section class="pa-0 pa-md-4">
        <h2 v-if="title" class="text-h4 text-sm-h3 text-md-h2 mb-4 mb-md-8">{{ title }}</h2>
        <h5 v-if=subtitle class="text-h6 text-md-h5 mb-2 mb-md-4">{{ subtitle }}</h5>
        <slot></slot>
    </section>
</template>

<script setup>
defineProps(["title", "subtitle"]);
</script>