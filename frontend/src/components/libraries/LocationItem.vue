<template>
    <div class="location">
        <span>{{ location }}</span>
        <span class="remove" @click="this.$emit('remove')">x</span>
    </div>
</template>

<script>
export default {
    props: ["location"]
}
</script>

<style scoped>
.location {
    background-color: var(--primary-light);
    display: flex;
    gap: 0.5rem;
    padding: 0.25rem 1rem;
    border-radius: 0.75rem;
}
.remove {
    color: var(--label-color);
    cursor: pointer;
}
</style>