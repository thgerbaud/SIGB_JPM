<template>
    <ConfirmDialog v-model="confirmDialog" v-bind="dialogOptions" @cancel="confirmDialog = false" @ok="removeAdmin" />

    <v-list-item>
        <v-list-item-title>
            <span>{{ admin.email }}</span>
            <span v-if="isCurrentUser" class="font-italic"> (vous)</span>
        </v-list-item-title>
        <v-list-item-subtitle v-if="admin.pending">
            <span>Invitation envoyée...</span>
        </v-list-item-subtitle>
        <template #append v-if="!isCurrentUser">
            <v-btn-cancel v-if="admin.pending" prepend-icon="mdi-email-remove-outline"
                @click="confirmDialog = true">Annuler</v-btn-cancel>
            <v-btn-cancel v-else prepend-icon="mdi-account-remove" @click="confirmDialog = true"
                :loading="loading">Exclure</v-btn-cancel>
        </template>
    </v-list-item>
</template>

<script>
import ConfirmDialog from '@/components/utils/dialogs/ConfirmDialog.vue';
import { deleteAdmin } from '@/services/LibraryDataService';
export default {
    props: ["admin"],
    data() {
        return {
            libraryId: this.$store.state.library.id,
            user: this.$store.state.user,
            confirmDialog: false,
            loading: false,
        }
    },
    computed: {
        isCurrentUser() {
            return this.admin.email === this.user.email;
        },
        dialogOptions() {
            return (this.admin.pending) ? {
                title: "Annuler l'invitation ?",
                icon: "mdi-email-remove",
                text: "La personne ne pourra plus utiliser le lien envoyé pour accéder à votre bibliothèque.",
                cancelText: "Revenir",
                okText: "Annuler l'invitation",
            } : {
                title: "Exclure l'administrateur ?",
                icon: "mdi-account-remove",
                text: "La personne ne pourra plus accéder à votre bibliothèque.",
                cancelText: "Revenir",
                okText: "Exclure",
            };
        },
    },
    methods: {
        removeAdmin() {
            this.loading = true;
            deleteAdmin(this.libraryId, this.admin.id)
                .then(library => {
                    this.$emit('deleted', library);
                    this.$store.commit('setLibrary', library); //?
                    this.loading = false;
                })
                .catch(err => {
                    this.sending = false;
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
        },
    },
    components: {
        ConfirmDialog,
    },
    emits: ["deleted"]
}
</script>