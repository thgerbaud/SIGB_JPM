<template>
    <div>
        <p id="main-legend">Connectez-vous pour continuer</p>
        <GoogleButton />
    </div>
</template>

<script>
import GoogleButton from '@/components/login/GoogleButton.vue';
export default {
    components: {
        GoogleButton
    }
}
</script>

<style scoped>
#main-legend {
    color: var(--white);
    font-size: var(--medium3);
    text-align: center;
    font-family: system-ui;
    font-weight: 300;
    margin-bottom: 2rem;
}
</style>