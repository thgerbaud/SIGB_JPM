<template>
    <EditBookModal :book="book" :library="library" v-model="editBookModal" @cancel="editBookModal = false"
        @save="save" />

    <ConfirmDialog title="Supprimer le livre ?" cancelText="Annuler" okText="Supprimer" v-model="deleteDialog"
        :text='`Etes-vous sûr de vouloir supprimer le livre "${book.details.title}" ? Tous les exemplaires seront retirés de la bibliothèques.`'
        @cancel="deleteDialog = false" @ok="deleteBook"/>

    <v-toolbar density="compact" class="my-2">
        <v-spacer></v-spacer>
        <v-btn-secondary color="error" prepend-icon="mdi-delete-outline" class="mr-2"
            @click="deleteDialog = true">Supprimer</v-btn-secondary>
        <v-btn prepend-icon="mdi-pencil" variant="flat" @click="editBookModal = true">Modifier</v-btn>
    </v-toolbar>
</template>

<script>
import EditBookModal from '@/components/book/EditBookModal.vue';
import ConfirmDialog from '@/components/utils/ConfirmDialog.vue';
export default {
    props: ["book", "library"],
    data() {
        return {
            editBookModal: false,
            deleteDialog: false
        }
    },
    components: {
        EditBookModal,
        ConfirmDialog
    },
    methods: {
        save(data) {
            this.$emit('update', data);
            this.editBookModal = false;
        },
        deleteBook() {
            this.$emit('delete');
            this.deleteDialog = false;
        },
    },
    emits: ["update", "delete"],
}
</script>