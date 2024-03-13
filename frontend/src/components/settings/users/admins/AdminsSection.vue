<template>
    <SettingsSectionTemplate :title="`Administrateurs (${library.admins?.length ?? 0}/${maxAdmins})`">
        <template #content>
            <v-list>
                <AdminListItem v-for="admin in library.admins" :key="admin.id" :admin="admin"
                    @deleted="(library) => { deletedSnackbar = true; update(library) }" />
            </v-list>
            <v-snackbar v-model="deletedSnackbar" color="primary" timeout="3000">
                <v-icon icon="mdi-check-circle-outline"></v-icon>
                Administrateur supprimé.
            </v-snackbar>
        </template>
        <template #actions>
            <div v-if="(library.admins?.length ?? 0) < maxAdmins">
                <v-btn prepend-icon="mdi-plus" class="mt-2" @click="addAdminModal = true">Ajouter un administrateur</v-btn>
                <AddAdminModal :library="library" v-model="addAdminModal" @cancel="closeModal"
                    @update="(library) => { closeModal(); update(library) }" />
            </div>
            <p v-else class="font-italic">Nombre maximal d'administrateurs atteint.</p>
        </template>
    </SettingsSectionTemplate>
</template>

<script>
import SettingsSectionTemplate from '@/components/settings/SettingsSectionTemplate.vue';
import AddAdminModal from '@/components/settings/users/admins/AddAdminModal.vue';
import AdminListItem from '@/components/settings/users/admins/AdminListItem.vue';
export default {
    props: ["library"],
    data() {
        return {
            maxAdmins: 3,
            addAdminModal: false,
            deletedSnackbar: false,
        }
    },
    methods: {
        closeModal() {
            this.addAdminModal = false;
        },
        update(library) {
            this.$store.commit('setLibrary', library);
        },
    },
    components: {
        SettingsSectionTemplate,
        AddAdminModal,
        AdminListItem,
    },
}
</script>