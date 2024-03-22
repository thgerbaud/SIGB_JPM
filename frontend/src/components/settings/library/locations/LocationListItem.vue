<template>
    <ConfirmDeletionDialog v-model="confirmDialog" v-bind="dialogOptions" @cancel="confirmDialog = false" @ok="confirmDeletion" />

    <EditLocationModal v-model="editLocationModal" :library="library" :location="location" @cancel="closeEditModal"
        @update="(library) => { closeEditModal(); emit('update', library) }" />

    <SettingsListItem :title="location.name" :loading="loading" @edit="editLocationModal = true"
        @delete="confirmDialog = true" />
</template>

<script setup>
import { ref, computed, inject } from 'vue';
import ConfirmDeletionDialog from '@/components/utils/dialogs/ConfirmDeletionDialog.vue';
import EditLocationModal from '@/components/settings/library/locations/EditLocationModal.vue';
import SettingsListItem from '@/components/settings/SettingsListItem.vue';
import { deleteLocation } from '@/services/LibraryDataService';

const props = defineProps(["location", "library"]);
const emit = defineEmits(["update"]);
const globalEmitter = inject('globalEmitter');

const confirmDialog = ref(false);
const editLocationModal = ref(false);
const loading = ref(false);

const dialogOptions = computed(() => {
    return {
        title: `Supprimer l'emplacement «${props.location.name}» ?`,
        icon: "mdi-map-marker-remove",
        text: "Tous les exemplaires associés à cet emplacement seront conservés, mais le champ Emplacement sera changé en «Non précisé».",
        cancelText: "Annuler",
        okText: "Supprimer",
    }
});

function closeEditModal() {
    editLocationModal.value = false;
}

function confirmDeletion() {
    confirmDialog.value = false;
    loading.value = true;
    deleteLocation(props.library.id, props.location.id)
        .then(library => {
            emit('update', library);
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