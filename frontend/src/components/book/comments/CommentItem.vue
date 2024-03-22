<template>
    <ConfirmDeletionDialog v-if="isMine" v-model="confirmDeleteDialog" title="Confirmer la suppression" okText="Supprimer" cancelText="Annuler"
        text="Voulez-vous supprimer votre commentaire ?" icon="mdi-forum-remove"
        @cancel="confirmDeleteDialog = false" @ok="confirmDeletion" />

    <v-card class="mb-2 d-flex" variant="outlined">
        <v-card-text>
            <legend><span class="font-weight-bold">{{ (isMine) ? "Vous" : formattedAuthor }}</span> {{ fomattedDate }}
            </legend>
            <v-rating v-model="comment.rating" density="compact" readonly></v-rating>
            <p>{{ comment.text }}</p>
        </v-card-text>
        <v-card-actions class="d-flex justify-end" v-if="isMine">
            <v-tooltip text="Supprimer mon commentaire">
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" icon="mdi-delete" color="error" @click="confirmDeleteDialog = true"></v-btn>
                </template>
            </v-tooltip>
        </v-card-actions>
    </v-card>
</template>

<script setup>
import { ref, computed, inject } from 'vue';
import { useUserStore } from '@/store/user';
import { deleteComment } from '@/services/BookDataService';
import ConfirmDeletionDialog from '@/components/utils/dialogs/ConfirmDeletionDialog.vue';

const props = defineProps(["comment", "bookId"]);
const emit = defineEmits(["update"]);
const userStore = useUserStore();
const globalEmitter = inject('globalEmitter');

const confirmDeleteDialog = ref(false);

const fomattedDate = computed(() => {
    const date = new Date(props.comment.date);
    const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    };
    return date.toLocaleDateString('fr-FR', options);
});

const formattedAuthor = computed(() => {
    return props.comment.author.split("@")[0]
})

const isMine = computed(() => {
    return props.comment.author === userStore.user.email;
});

function confirmDeletion() {
    deleteComment(props.bookId, props.comment.id)
        .then(updatedBook => {
            emit('update', updatedBook, "Commentaire supprimé");
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
</script>