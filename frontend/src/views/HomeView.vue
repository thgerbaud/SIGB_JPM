<template>
    <v-main class="bg-primary">
        <router-view></router-view>
    </v-main>
</template>

<script>
export default {
    created() {
        document.body.id = 'dark';
    }
}
</script>