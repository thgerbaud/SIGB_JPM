<template>
    <SettingsSectionTemplate :title="`Invités (${library.users?.length ?? 0}/${maxGuests})`">
        <template #content>
            <v-list v-if="library.users?.length > 0">
                <GuestListItem v-for="user in library.users" :key="user.id" :guest="user"
                    @deleted="(library) => { deletedSnackbar = true; update(library) }" />
            </v-list>
            <p v-else class="font-italic">Aucun invité pour le moment</p>
            <v-snackbar v-model="deletedSnackbar" color="primary" timeout="3000">
                <v-icon icon="mdi-check-circle-outline"></v-icon>
                Invité supprimé.
            </v-snackbar>
        </template>
        <template #actions>
            <div v-if="(library.users?.length ?? 0) < maxGuests">
                <v-btn prepend-icon="mdi-plus" class="mt-2" @click="addGuestModal = true">Ajouter un invité</v-btn>
                <AddGuestModal :library="library" v-model="addGuestModal" @cancel="closeModal"
                    @update="(library) => { closeModal(); update(library) }" />
            </div>
            <p v-else class="font-italic">Nombre maximal d'invités atteint.</p>
        </template>
    </SettingsSectionTemplate>
</template>

<script>
import SettingsSectionTemplate from '@/components/settings/SettingsSectionTemplate.vue';
import GuestListItem from '@/components/settings/users/guests/GuestListItem.vue';
import AddGuestModal from '@/components/settings/users/guests/AddGuestModal.vue';
export default {
    props: ["library"],
    data() {
        return {
            maxGuests: 10,
            addGuestModal: false,
            deletedSnackbar: false,
        }
    },
    methods: {
        closeModal() {
            this.addGuestModal = false;
        },
        update(library) {
            this.$store.commit('setLibrary', library);
        },
    },
    components: {
        SettingsSectionTemplate,
        GuestListItem,
        AddGuestModal,
    },
}
</script>