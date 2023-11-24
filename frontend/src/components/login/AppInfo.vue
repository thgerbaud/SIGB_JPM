<template>
    <div id="app-info">
        <img id="app-logo" alt="logo">
        <legend id="app-name">Nom de l'application</legend>
    </div>
</template>

<style scoped>
#app-info {
    display: flex;
    margin-bottom: 4rem;
    gap: 1rem;
    align-items: center;
}

#app-logo {
    /* temp */
    color: white;
    height: 4rem;
    width: 4rem;
}

#app-name {
    font-size: var(--large1);
    color: var(--white);
}
</style>