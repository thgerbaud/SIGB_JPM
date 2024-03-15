<template>
    <DeleteModal v-model="deleteModal" :name="library.name" @cancel="deleteModal = false" @delete="confirmDeletion" />
    <SuccessDialog v-model="successDialog" />

    <div class="text-right mt-4">
        <v-btn color="error" prepend-icon="mdi-delete" @click="deleteModal = true">Supprimer la bibliothèque</v-btn>
    </div>
</template>

<script setup>
import { ref, inject } from 'vue';
import DeleteModal from '@/components/settings/library/delete/DeleteModal.vue';
import SuccessDialog from '@/components/settings/library/delete/SucessDialog.vue';
import { deleteLibrary } from '@/services/LibraryDataService';

const props = defineProps(["library"]);
const globalEmitter = inject('globalEmitter');

const deleteModal = ref(false);
const successDialog = ref(false);

function confirmDeletion() {
    deleteLibrary(props.library.id)
        .then(() => {
            deleteModal.value = false;
            successDialog.value = true;
        })
        .catch(err => {
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
        });
}
</script>