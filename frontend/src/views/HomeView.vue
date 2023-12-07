<template>
    <router-view></router-view>
</template>

<script>
export default {
    created() {
        document.body.id = 'dark';
    }
}
</script>