<template>
    <AddCopyModal :library="library" :bookId="book.id" v-model="addCopyModal" @cancel="addCopyModal = false"
        @update="updateBook" />

    <EditCopyModal :copy="selectedCopy" :library="library" :bookId="book.id" v-model="editCopyModal"
        @cancel="editCopyModal = false" @update="updateBook" />

    <ConfirmDialog v-model="confirmDeleteDialog" title="Supprimer l'exemplaire" okText="Supprimer" cancelText="Annuler"
        :text="`Êtes-vous sûr(e) de vouloir supprimer l'exemplaire de «${book.details.title}» avec le code ${selectedCopy?.code} ? (supprimer le dernier exemplaire d'un livre supprimera entièrement le livre)`"
        @cancel="confirmDeleteDialog = false" @ok="confirmDeletion" />

    <span class="d-flex mt-4">
        <v-table density="compact">
            <thead>
                <tr>
                    <th class="font-weight-bold">Code</th>
                    <th class="font-weight-bold">Emplacement</th>
                </tr>
            </thead>
            <tbody>
                <CopyRaw v-for="(copy, index) in book.copies" :key="copy.id" :copy="copy" :library="library"
                    @edit="editCopy(index)" @delete="openDeleteCopyDialog(index)" />
            </tbody>
        </v-table>
    </span>

    <v-btn variant="text" prepend-icon="mdi-plus" v-if="library.isAdmin" @click="addCopyModal = true">ajouter un
        exemplaire</v-btn>
</template>

<script>
import CopyRaw from '@/components/book/copies/CopyRaw.vue';
import AddCopyModal from '@/components/book/AddCopyModal.vue';
import EditCopyModal from '@/components/book/copies/EditCopyModal.vue';
import ConfirmDialog from '@/components/utils/dialogs/ConfirmDialog.vue';
import {deleteCopy } from '@/services/BookDataService';
export default {
    props: ["book", "library"],
    data() {
        return {
            addCopyModal: false,
            editCopyModal: false,
            confirmDeleteDialog: false,
            selectedCopy: null
        }
    },
    components: {
        CopyRaw,
        AddCopyModal,
        EditCopyModal,
        ConfirmDialog
    },
    methods: {
        editCopy(i) {
            this.selectedCopy = this.book.copies[i];
            this.editCopyModal = true;
        },
        openDeleteCopyDialog(i) {
            this.selectedCopy = this.book.copies[i];
            this.confirmDeleteDialog = true;
        },
        confirmDeletion() {
            this.confirmDeleteDialog = false;
            deleteCopy(this.book.id, this.selectedCopy.id)
                .then(updatedBook => {
                    this.$emit('update', updatedBook);
                })
                .catch(err => {
                    if (err.message.includes('[401]')) {
                        this.globalEmitter.emit('401');
                    } else if (err.message.includes('[403]')) {
                        this.globalEmitter.emit('403');
                    } else if (err.message.includes('[404]')) {
                        this.globalEmitter.emit('404');
                    } else if (err.message.includes('[400]')) {
                        const errorMessage = "Hmm... Il semblerait qu'un ou plusieurs paramètres soient invalides, veuillez réessayer...";
                        this.globalEmitter.emit('error', { message: errorMessage });
                    } else if (err.message.includes('[500]')) {
                        this.globalEmitter.emit('error', { message: "Oups! Une erreur s'est produite du côté du serveur..." });
                    } else {
                        this.globalEmitter.emit('error', { message: "Oups! Une erreur inattendue s'est produite..." });
                    }
                });
        },
        updateBook(updatedBook) {
            this.addCopyModal = false;
            this.editCopyModal = false;
            this.$emit('update', updatedBook);
        }
    },
    emits: ["update"]
}
</script>