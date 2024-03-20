<template>
    <InfoDialog v-model="infoDialog" @ok="router.push(`/${library.id}/books`)" title="Livre supprimé"
        message="Votre livre a bien été supprimé, vous allez être redirigé vers la page d'accueil de la bibliothèque." />

    <EditBookModal :book="book" :library="library" v-model="editBookModal" @cancel="editBookModal = false"
        @save="editBook" />

    <ConfirmDialog title="Supprimer le livre ?" cancelText="Annuler" okText="Supprimer" v-model="deleteDialog"
        :text='`Etes-vous sûr de vouloir supprimer le livre "${book.details.title}" ? Tous les exemplaires seront retirés de la bibliothèques.`'
        @cancel="deleteDialog = false" @ok="confirmDeletion" />

    <v-toolbar density="compact" class="my-2 bg-transparent">
        <v-spacer></v-spacer>
        <v-btn-secondary color="error" prepend-icon="mdi-delete-outline" class="mr-2"
            @click="deleteDialog = true">Supprimer</v-btn-secondary>
        <v-btn prepend-icon="mdi-pencil" variant="flat" @click="editBookModal = true">Modifier</v-btn>
    </v-toolbar>
</template>

<script setup>
import { ref, inject } from 'vue';
import { useRouter } from 'vue-router';
import EditBookModal from '@/components/book/EditBookModal.vue';
import ConfirmDialog from '@/components/utils/dialogs/ConfirmDialog.vue';
import InfoDialog from '@/components/utils/dialogs/InfoDialog.vue';
import { update, deleteBook } from '@/services/BookDataService';

const props = defineProps(["book", "library"]);
const emit = defineEmits(["update"]);
const router = useRouter();
const globalEmitter = inject('globalEmitter');

const editBookModal = ref(false);
const deleteDialog = ref(false);
const infoDialog = ref(false);

function editBook(data) {
    update(props.book.id, data)
        .then(updatedBook => {
            editBookModal.value = false;
            emit('update', updatedBook);
        })
        .catch(err => {
            processError(err);
        });
}

function confirmDeletion() {
    deleteDialog.value = false;
    deleteBook(props.book.id)
        .then(() => {
            infoDialog.value = true;
        })
        .catch(err => {
            processError(err);
        });
}

function processError(err) {
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
}
</script>