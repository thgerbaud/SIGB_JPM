<template>
    <InfoDialog v-model="infoDialog" @ok="$router.push(`/${library.id}/books`)" title="Livre supprimé"
        message="Votre livre a bien été supprimé, vous allez être redirigé vers la page d'accueil de la bibliothèque." />

    <EditBookModal :book="book" :library="library" v-model="editBookModal" @cancel="editBookModal = false" @save="editBook" />

    <ConfirmDialog title="Supprimer le livre ?" cancelText="Annuler" okText="Supprimer" v-model="deleteDialog"
        :text='`Etes-vous sûr de vouloir supprimer le livre "${book.details.title}" ? Tous les exemplaires seront retirés de la bibliothèques.`'
        @cancel="deleteDialog = false" @ok="deleteBook" />

    <v-toolbar density="compact" class="my-2">
        <v-spacer></v-spacer>
        <v-btn-secondary color="error" prepend-icon="mdi-delete-outline" class="mr-2"
            @click="deleteDialog = true">Supprimer</v-btn-secondary>
        <v-btn prepend-icon="mdi-pencil" variant="flat" @click="editBookModal = true">Modifier</v-btn>
    </v-toolbar>
</template>

<script>
import EditBookModal from '@/components/book/EditBookModal.vue';
import ConfirmDialog from '@/components/utils/dialogs/ConfirmDialog.vue';
import InfoDialog from '@/components/utils/dialogs/InfoDialog.vue';
import BookDataService from '@/services/BookDataService';
export default {
    props: ["book", "library"],
    data() {
        return {
            editBookModal: false,
            deleteDialog: false,
            infoDialog: false
        }
    },
    components: {
        EditBookModal,
        ConfirmDialog,
        InfoDialog
    },
    methods: {
        editBook(data) {
			BookDataService.update(this.book.id, data)
				.then(updatedBook => {
                    this.editBookModal = false;
                    this.$emit('update', updatedBook);
				})
				.catch(err => {
					this.processError(err);
				});
		},
        deleteBook() {
            this.deleteDialog = false;
            BookDataService.delete(this.book.id)
                .then(() => {
                    this.infoDialog = true;
                })
                .catch(err => {
                    this.processError(err);
                });
        },
        processError(err) {
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
        }
    },
    emits: ["update"],
}
</script>