<template>
    <SettingsSectionTemplate :title="`Emplacements (${library.locations?.length ?? 0})`">
        <template #content>
            <v-list v-if="library.locations?.length > 0">
                <LocationListItem v-for="location in library.locations" :location="location" :library="library"
                    :key="location.id" @update="update"/>
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

<script>
import SettingsSectionTemplate from '@/components/settings/SettingsSectionTemplate.vue';
import LocationListItem from '@/components/settings/library/locations/LocationListItem.vue';
import AddLocationModal from '@/components/settings/library/locations/AddLocationModal.vue';
export default {
    props: ["library"],
    data() {
        return {
            addLocationModal: false,
            updatedSnackbar: false,
        }
    },
    methods: {
        closeModal() {
            this.addLocationModal = false;
        },
        update(library) {
            this.$store.commit('setLibrary', library);
            this.updatedSnackbar = true;
        },
    },
    components: {
        SettingsSectionTemplate,
        LocationListItem,
        AddLocationModal,
    },
}
</script>