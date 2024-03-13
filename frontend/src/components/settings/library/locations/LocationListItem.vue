<template>
    <ConfirmDialog v-model="confirmDialog" v-bind="dialogOptions" @cancel="confirmDialog = false" @ok="deleteLocation" />

    <EditLocationModal v-model="editLocationModal" :library="library" :location="location" @cancel="closeEditModal"
        @update="(library) => { closeEditModal(); $emit('update', library) }" />

    <v-list-item>
        <v-list-item-title>
            <span :class="{ active: hover }">{{ location.name }}</span>
        </v-list-item-title>
        <template #append>
            <div @mouseover="hover = true" @mouseleave="hover = false">
                <v-btn-secondary prepend-icon="mdi-pencil-outline" class="mr-2" density="comfortable"
                    @click="editLocationModal = true">Modifier</v-btn-secondary>
                <v-btn-cancel prepend-icon="mdi-delete-outline" density="comfortable" @click="confirmDialog = true"
                    :loading="loading">Supprimer</v-btn-cancel>
            </div>
        </template>
    </v-list-item>
</template>

<script>
import ConfirmDialog from '@/components/utils/dialogs/ConfirmDialog.vue';
import EditLocationModal from '@/components/settings/library/locations/EditLocationModal.vue';
import { deleteLocation } from '@/services/LibraryDataService';
export default {
    props: ["location", "library"],
    emits: ["update"],
    data() {
        return {
            hover: false,
            confirmDialog: false,
            editLocationModal: false,
            loading: false,
        }
    },
    computed: {
        dialogOptions() {
            return {
                title: `Supprimer l'emplacement «${this.location.name}» ?`,
                icon: "mdi-map-marker-remove",
                text: "Tous les exemplaires associés à cet emplacement seront conservés, mais le champ Emplacement sera changé en «Non précisé».",
                cancelText: "Annuler",
                okText: "Supprimer",
            }
        }
    },
    components: {
        ConfirmDialog,
        EditLocationModal,
    },
    methods: {
        closeEditModal() {
            this.editLocationModal = false;
        },
        deleteLocation() {
            this.confirmDialog = false;
            this.loading = true;
            deleteLocation(this.library.id, this.location.id)
                .then(library => {
                    this.$emit('update', library);
                    this.loading = false;
                })
                .catch(err => {
                    this.sending = false;
                    if (err.message.includes('[401]')) {
                        this.globalEmitter.emit('401');
                    } else if (err.message.includes('[403]')) {
                        this.globalEmitter.emit('403');
                    } else if (err.message.includes('[404]')) {
                        this.globalEmitter.emit('404');
                    } else if (err.message.includes('[400]')) {
                        this.globalEmitter.emit('error', { message: "Hmm... Il semblerait qu'un ou plusieurs paramètres soient invalides, veuillez réessayer..." });
                    } else if (err.message.includes('[500]')) {
                        this.globalEmitter.emit('error', { message: "Oups! Une erreur s'est produite du côté du serveur..." });
                    } else {
                        this.globalEmitter.emit('error', { message: "Oups! Une erreur inattendue s'est produite..." });
                    }
                });
        },
    },
}
</script>

<style>
.active {
    background-color: yellow;
}
</style>