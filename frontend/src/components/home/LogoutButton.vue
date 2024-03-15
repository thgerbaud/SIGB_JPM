<template>
    <LogoutConfirmDialog v-model="logoutDialog" @cancel="logoutDialog = false" />
    <div class="center-content">
        <v-btn-tertiary @click="logoutDialog = true" prepend-icon="mdi-logout">Déconnexion</v-btn-tertiary>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import LogoutConfirmDialog from '@/components/utils/dialogs/LogoutConfirmDialog.vue';

const logoutDialog = ref(false);
</script>
