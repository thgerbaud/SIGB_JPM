<template>
    <ConfirmDeletionDialog v-model="confirmDialog" v-bind="dialogOptions" @cancel="confirmDialog = false" @ok="removeGuest" />

    <SettingsUserListItem :user="guest" :loading="loading" @exclude="confirmDialog = true" />
</template>

<script setup>
import { ref, computed, inject } from 'vue';
import { useLibraryStore } from '@/store/library';
import ConfirmDeletionDialog from '@/components/utils/dialogs/ConfirmDeletionDialog.vue';
import SettingsUserListItem from '@/components/settings/users/SettingsUserListItem.vue';
import { deleteGuest } from '@/services/LibraryDataService';

const props = defineProps(["guest", "libraryId"]);
const emit = defineEmits(["deleted"]);
const libraryStore = useLibraryStore();
const globalEmitter = inject('globalEmitter');

const confirmDialog = ref(false);
const loading = ref(false);

const dialogOptions = computed(() => {
    return (props.guest.pending) ? {
        title: "Annuler l'invitation ?",
        icon: "mdi-email-remove",
        text: "La personne ne pourra plus utiliser le lien envoyé pour accéder à votre bibliothèque.",
        cancelText: "Revenir",
        okText: "Annuler l'invitation",
    } : {
        title: "Exclure l'invité ?",
        icon: "mdi-account-remove",
        text: "La personne ne pourra plus accéder à votre bibliothèque.",
        cancelText: "Revenir",
        okText: "Exclure",
    };
});

function removeGuest() {
    loading.value = true;
    deleteGuest(props.libraryId, props.guest.id)
        .then(library => {
            emit('deleted', library);
            libraryStore.setLibrary(library);
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