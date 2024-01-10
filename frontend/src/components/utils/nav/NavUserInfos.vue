<template>
    <div class="pointer">
        <span class="text-h6">{{ user.name }}</span>
        <v-avatar :image="user.picture" size="40" class="ml-2"></v-avatar>
    </div>
</template>

<script>
export default {
    props: ["user"]
}
</script>