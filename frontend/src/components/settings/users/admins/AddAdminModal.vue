<template>
    <v-dialog width="500" persistent>
        <v-card v-if="sent" title="Courriel envoyé">
            <template v-slot:prepend>
                <v-icon icon="mdi-email-arrow-right-outline" color="primary"></v-icon>
            </template>
            <v-card-text>
                <p>Un courriel a été envoyé à <span class="font-italic">{{ email }}@gmail.com</span> l'invitant à rejoindre
                    votre
                    bibliothèque en tant qu'administrateur !</p>
            </v-card-text>
            <v-card-actions>
                <v-btn block @click="update">Ok</v-btn>
            </v-card-actions>
        </v-card>

        <v-card v-else-if="sending">
            <v-card-text class="text-center">
                <v-progress-circular indeterminate color="primary" class="ma-4"></v-progress-circular>
                <p>Vérification de l'adresse et envoi du courriel...</p>
            </v-card-text>
        </v-card>

        <v-card v-else title="Ajouter un administrateur">
            <template v-slot:prepend>
                <v-icon icon="mdi-account-plus" color="primary"></v-icon>
            </template>
            <v-card-text>
                <v-form v-model="isFormValid" @submit.prevent>
                    <legend>Entrez l'adresse Gmail de l'administrateur à ajouter :</legend>
                    <v-text-field label="Adresse Gmail" variant="outlined" class="mt-4" suffix="@gmail.com" v-model="email"
                        :rules="[rules.required, rules.isValid, rules.duplicate, rules.length]" clearable
                        @input="handleEmailInput" maxlength="30"></v-text-field>
                    <legend>Si la personne a déjà accès à votre bibliothèque en tant que simple invité, elle sera retirée de
                        la liste des invités.</legend>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-btn color="error" class="flex-grow-1" @click="cancel">Annuler</v-btn>
                <v-btn class="flex-grow-1" @click="send" :disabled="!isFormValid">Ajouter</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import LibraryDataService from '@/services/LibraryDataService';
export default {
    emits: ["cancel", "update"],
    props: ["library"],
    data() {
        return {
            email: "",
            sent: false,
            sending: false,
            isFormValid: false,
            rules: {
                required: (value) => !!value?.trim() || "L'adresse ne doit pas être vide.",
                isValid: (value) => /^[a-zA-Z0-9.]+$/.test(value) || "Adresse invalide.",
                duplicate: (value) => !this.library.admins?.some(admin => admin.email === value + "@gmail.com") || "L'administrateur est déjà ajouté.",
                length: (value) => (value?.length > 5 && value?.length < 31) || "L'adresse doit contenir entre 6 et 30 caractères",
            },
            updatedLibrary: null,
        }
    },
    methods: {
        handleEmailInput() {
            this.email = this.email.replace(/[^a-zA-Z0-9.]/g, '');
        },
        send() {
            this.sending = true;
            LibraryDataService.addAdmin(this.library.id, this.email + "@gmail.com")
                .then(library => {
                    this.updatedLibrary = library;
                    this.sent = true;
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
                    } else if (err.message.includes('[409]')) {
                        this.globalEmitter.emit('error', { message: "Il semblerait que l'administrateur soit déjà ajouté." });
                    } else if (err.message.includes('[500]')) {
                        this.globalEmitter.emit('error', { message: "Oups! Une erreur s'est produite du côté du serveur..." });
                    } else {
                        this.globalEmitter.emit('error', { message: "Oups! Une erreur inattendue s'est produite..." });
                    }
                });
        },
        reset() {
            this.email = "";
            this.sending = false;
            this.sent = false;
        },
        cancel() {
            this.reset();
            this.$emit('cancel');
        },
        update() {
            this.reset();
            this.$emit('update', this.updatedLibrary);
        },
    },
}
</script>