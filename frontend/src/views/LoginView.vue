<template>
    <router-view id="home-container"></router-view>
</template>

<script>
export default {
    created() {
        document.body.id = 'dark';
    }
}
</script>