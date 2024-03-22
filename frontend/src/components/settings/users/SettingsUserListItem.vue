<template>
    <v-list-item>
        <v-list-item-title>
            <span>{{ user.email }}</span>
            <span v-if="isCurrentUser" class="font-italic"> (vous)</span>
        </v-list-item-title>
        <v-list-item-subtitle v-if="user.pending">
            <span>Invitation envoyée...</span>
        </v-list-item-subtitle>
        <template #append v-if="!isCurrentUser">
            <div v-if="mdAndUp">
                <v-btn-cancel v-if="user.pending" prepend-icon="mdi-email-remove-outline"
                    @click="emit('exclude')">Annuler</v-btn-cancel>
                <v-btn-cancel v-else prepend-icon="mdi-account-remove" @click="emit('exclude')"
                    :loading="loading">Exclure</v-btn-cancel>
            </div>
            <div v-else>
                <v-btn-cancel v-if="user.pending" icon="mdi-email-remove-outline"
                    @click="emit('exclude')" size="small"></v-btn-cancel>
                <v-btn-cancel v-else icon="mdi-account-remove" @click="emit('exclude')"
                    :loading="loading" size="small"></v-btn-cancel>
            </div>
        </template>
    </v-list-item>
</template>

<script setup>
import { useDisplay } from 'vuetify';

defineProps(["user", "isCurrentUser", "loading"]);
const emit = defineEmits(["exclude"]);
const { mdAndUp } = useDisplay();
</script>