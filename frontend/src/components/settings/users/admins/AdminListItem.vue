<template>
    <ConfirmDialog v-model="confirmDialog" v-bind="dialogOptions" @cancel="confirmDialog = false" @ok="removeAdmin" />

    <v-list-item>
        <v-list-item-title>
            <span>{{ admin.email }}</span>
            <span v-if="isCurrentUser" class="font-italic"> (vous)</span>
        </v-list-item-title>
        <v-list-item-subtitle v-if="admin.pending">
            <span>Invitation envoyée...</span>
        </v-list-item-subtitle>
        <template #append v-if="!isCurrentUser">
            <v-btn-cancel v-if="admin.pending" prepend-icon="mdi-email-remove-outline"
                @click="confirmDialog = true">Annuler</v-btn-cancel>
            <v-btn-cancel v-else prepend-icon="mdi-account-remove" @click="confirmDialog = true"
                :loading="loading">Exclure</v-btn-cancel>
        </template>
    </v-list-item>
</template>

<script setup>
import { ref, inject, computed } from 'vue';
import { useStore } from 'vuex';
import ConfirmDialog from '@/components/utils/dialogs/ConfirmDialog.vue';
import { deleteAdmin } from '@/services/LibraryDataService';

const props = defineProps(["admin", "libraryId"]);
const emit = defineEmits(["deleted"]);
const globalEmitter = inject('globalEmitter');
const store = useStore();

const user = store.state.user;
const confirmDialog = ref(false);
const loading = ref(false);

const isCurrentUser = computed(() => {
    return props.admin.email === user.email;
});

const dialogOptions = computed(() => {
    return (props.admin.pending) ? {
        title: "Annuler l'invitation ?",
        icon: "mdi-email-remove",
        text: "La personne ne pourra plus utiliser le lien envoyé pour accéder à votre bibliothèque.",
        cancelText: "Revenir",
        okText: "Annuler l'invitation",
    } : {
        title: "Exclure l'administrateur ?",
        icon: "mdi-account-remove",
        text: "La personne ne pourra plus accéder à votre bibliothèque.",
        cancelText: "Revenir",
        okText: "Exclure",
    };
});

function removeAdmin() {
    loading.loading = true;
    deleteAdmin(props.libraryId, props.admin.id)
        .then(library => {
            emit('deleted', library);
            store.commit('setLibrary', library);
            confirmDialog.value = false;
            loading.value = false;
        })
        .catch(err => {
            loading.value = false;
            if (err.message.includes('[401]')) {
                globalEmitter.emit('401');
            } else if (err.message.includes('[403]')) {
                globalEmitter.emit('403');
            } else if (err.message.includes('[404]')) {
                globalEmitter.emit('404');
            } else if (err.message.includes('[400]')) {
                globalEmitter.emit('error', { message: "Hmm... Il semblerait qu'un ou plusieurs paramètres soient invalides, veuillez réessayer..." });
            } else if (err.message.includes('[500]')) {
                globalEmitter.emit('error', { message: "Oups! Une erreur s'est produite du côté du serveur..." });
            } else {
                globalEmitter.emit('error', { message: "Oups! Une erreur inattendue s'est produite..." });
            }
        });
}
</script>