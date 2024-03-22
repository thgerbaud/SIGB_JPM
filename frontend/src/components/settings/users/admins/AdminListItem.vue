<template>
    <ConfirmDeletionDialog v-model="confirmDialog" v-bind="dialogOptions" @cancel="confirmDialog = false" @ok="removeAdmin" />

    <SettingsUserListItem :user="admin" :is-current-user="isCurrentUser" :loading="loading"
        @exclude="confirmDialog = true" />
</template>

<script setup>
import { ref, inject, computed } from 'vue';
import { useLibraryStore } from '@/store/library';
import { useUserStore } from '@/store/user';
import ConfirmDeletionDialog from '@/components/utils/dialogs/ConfirmDeletionDialog.vue';
import SettingsUserListItem from '@/components/settings/users/SettingsUserListItem.vue';
import { deleteAdmin } from '@/services/LibraryDataService';

const props = defineProps(["admin", "libraryId"]);
const emit = defineEmits(["deleted"]);
const globalEmitter = inject('globalEmitter');
const libraryStore = useLibraryStore();
const userStore = useUserStore();

const user = userStore.user;

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
            libraryStore.setLibrary(library);
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