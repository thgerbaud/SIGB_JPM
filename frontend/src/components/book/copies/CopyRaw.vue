<template>
    <EditCopyModal :copy="copy" :library="library" :bookId="book.id" v-model="editCopyModal" @cancel="editCopyModal = false"
        @update="updateBook" />

    <ConfirmDialog v-model="confirmDeleteDialog" title="Supprimer l'exemplaire" okText="Supprimer" cancelText="Annuler"
        :text="`Êtes-vous sûr(e) de vouloir supprimer l'exemplaire de «${book.details.title}» avec le code ${copy?.code} ? (supprimer le dernier exemplaire d'un livre supprimera entièrement le livre)`"
        @cancel="confirmDeleteDialog = false" @ok="confirmDeletion" />

    <tr>
        <td>{{ copy.code }}</td>
        <td>{{ locationToString(copy.location) }}</td>
        <td v-if="library.isAdmin">
            <v-icon icon="mdi-pencil" class="mr-4" @click="editCopyModal = true"></v-icon>
            <v-icon icon="mdi-delete" color="error" @click="confirmDeleteDialog = true"></v-icon>
        </td>
    </tr>
</template>

<script setup>
import { ref, inject } from 'vue';
import { deleteCopy } from '@/services/BookDataService';
import EditCopyModal from '@/components/book/copies/EditCopyModal.vue';
import ConfirmDialog from '@/components/utils/dialogs/ConfirmDialog.vue';

const props = defineProps(["copy", "library", "book"]);
const emit = defineEmits(["update"]);
const globalEmitter = inject('globalEmitter');

const editCopyModal = ref(false);
const confirmDeleteDialog = ref(false);

function locationToString(id) {
    const location = id ? props.library.locations?.find(location => location.id === id) : null
    if (location) {
        return location.name;
    } else {
        return "Non précisé"
    }
}

function confirmDeletion() {
    confirmDeleteDialog.value = false;
    deleteCopy(props.book.id, props.copy.id)
        .then(updatedBook => {
            emit('update', updatedBook);
        })
        .catch(err => {
            if (err.message.includes('[401]')) {
                globalEmitter.emit('401');
            } else if (err.message.includes('[403]')) {
                globalEmitter.emit('403');
            } else if (err.message.includes('[404]')) {
                globalEmitter.emit('404');
            } else if (err.message.includes('[400]')) {
                const errorMessage = "Hmm... Il semblerait qu'un ou plusieurs paramètres soient invalides, veuillez réessayer...";
                globalEmitter.emit('error', { message: errorMessage });
            } else if (err.message.includes('[500]')) {
                globalEmitter.emit('error', { message: "Oups! Une erreur s'est produite du côté du serveur..." });
            } else {
                globalEmitter.emit('error', { message: "Oups! Une erreur inattendue s'est produite..." });
            }
        });
}

function updateBook(updatedBook) {
    editCopyModal.value = false;
    emit('update', updatedBook);
}
</script>