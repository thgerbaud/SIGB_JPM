<template>
    <SettingsSectionTemplate :title="`Emplacements (${library.locations?.length ?? 0})`">
        <template #content>
            <v-list v-if="library.locations?.length > 0">
                <LocationListItem v-for="location in library.locations" :location="location" :library="library"
                    :key="location.id" @update="update" />
            </v-list>
            <p v-else class="font-italic">Aucun emplacement pour le moment</p>
            <v-snackbar color="primary" timeout="3000" v-model="updatedSnackbar">
                <v-icon icon="mdi-check-circle-outline"></v-icon>
                Emplacements mis à jour.
            </v-snackbar>
        </template>
        <template #actions>
            <v-btn prepend-icon="mdi-plus" class="mt-2" @click="addLocationModal = true">Ajouter un emplacement</v-btn>
            <AddLocationModal v-model="addLocationModal" :library="library" @cancel="closeModal"
                @update="(library) => { closeModal(); update(library) }" />
        </template>
    </SettingsSectionTemplate>
</template>

<script setup>
import { ref } from 'vue';
import { useLibraryStore } from '@/store/library';
import SettingsSectionTemplate from '@/components/settings/SettingsSectionTemplate.vue';
import LocationListItem from '@/components/settings/library/locations/LocationListItem.vue';
import AddLocationModal from '@/components/settings/library/locations/AddLocationModal.vue';

defineProps(["library"]);
const libraryStore = useLibraryStore();

const addLocationModal = ref(false);
const updatedSnackbar = ref(false);

function closeModal() {
    addLocationModal.value = false;
}

function update(library) {
    libraryStore.setLibrary(library);
    updatedSnackbar.value = true;
}
</script>