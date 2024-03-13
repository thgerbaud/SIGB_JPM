<template>
    <v-app-bar color="primary">
        <template v-slot:prepend v-if="library.isAdmin">
            <v-tooltip text="Paramètres" location="bottom">
                <template v-slot:activator="{ props }">
                    <v-icon v-bind="props" icon="mdi-cog" class="pointer"
                        @click="$router.push(`/${library.id}/settings`)"></v-icon>
                </template>
            </v-tooltip>
        </template>
        <v-app-bar-title @click="$router.push(`/${library.id}/books`)" class="pointer">{{ library.name }}</v-app-bar-title>
        <template v-slot:append>
            <NavUserMenu :user="user" :libraryName="library.name" />
        </template>
    </v-app-bar>
</template>

<script>
import NavUserMenu from '@/components/utils/nav/NavUserMenu.vue';
export default {
    props: ["library"],
    data() {
        return {
            user: this.$store.state.user,
        };
    },
    components: {
        NavUserMenu
    },
}
</script>