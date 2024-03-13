<template>
    <DeleteModal v-model="deleteModal" :name="library.name" @cancel="deleteModal = false" @delete="deleteLibrary"/>
    <SuccessDialog v-model="successDialog" />

    <div class="text-right mt-4">
        <v-btn color="error" prepend-icon="mdi-delete" @click="deleteModal = true">Supprimer la bibliothèque</v-btn>
    </div>
</template>

<script>
import DeleteModal from '@/components/settings/library/delete/DeleteModal.vue';
import SuccessDialog from '@/components/settings/library/delete/SucessDialog.vue';
import LibraryDataService from '@/services/LibraryDataService';
export default {
    props: ["library"],
    data() {
        return {
            deleteModal: false,
            successDialog: false,
        }
    },
    components: {
        DeleteModal,
        SuccessDialog,
    },
    methods: {
        deleteLibrary() {
            LibraryDataService.delete(this.library.id)
                .then(() => {
                    this.deleteModal = false;
                    this.successDialog = true;
                })
                .catch(err => {
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
        }
    }
}
</script>