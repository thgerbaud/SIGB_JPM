<template>
    <main class="center-content">
        <AppInfo />
        <LoginOptions />
    </main>
</template>

<script>
import AppInfo from '@/components/login/AppInfo.vue';
import LoginOptions from '@/components/login/LoginOptions.vue';
export default {
    components: {
        AppInfo,
        LoginOptions
    }
};
</script>

<style scoped>
main {
    padding-top: 6rem;
}
</style>