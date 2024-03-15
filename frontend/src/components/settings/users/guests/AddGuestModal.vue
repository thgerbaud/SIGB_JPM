<template>
    <v-dialog width="500" persistent>
        <v-card v-if="sent" title="Courriel envoyé">
            <template v-slot:prepend>
                <v-icon icon="mdi-email-arrow-right-outline" color="primary"></v-icon>
            </template>
            <v-card-text>
                <p>Un courriel a été envoyé à <span class="font-italic">{{ email }}@gmail.com</span> l'invitant à rejoindre
                    votre
                    bibliothèque !</p>
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

        <v-card v-else title="Ajouter un invité">
            <template v-slot:prepend>
                <v-icon icon="mdi-account-plus" color="primary"></v-icon>
            </template>
            <v-card-text>
                <v-form v-model="isFormValid" @submit.prevent>
                    <legend>Entrez l'adresse Gmail de la personne à inviter :</legend>
                    <v-text-field label="Adresse Gmail" variant="outlined" class="mt-4" suffix="@gmail.com" v-model="email"
                        :rules="[rules.required, rules.isValid, rules.duplicateInUsers, rules.duplicateInAdmins, rules.length]"
                        clearable @input="handleEmailInput" maxlength="30"></v-text-field>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-btn color="error" class="flex-grow-1" @click="cancel">Annuler</v-btn>
                <v-btn class="flex-grow-1" @click="send" :disabled="!isFormValid">Ajouter</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref, inject } from 'vue';
import { addGuest } from '@/services/LibraryDataService';

const props = defineProps(["library"]);
const emit = defineEmits(["cancel", "update"]);
const globalEmitter = inject('globalEmitter');

const email = ref("");
const updatedLibrary = ref(null);
const sent = ref(false);
const sending = ref(false);
const isFormValid = ref(false);
const rules = {
    required: (value) => !!value?.trim() || "L'adresse ne doit pas être vide.",
    isValid: (value) => /^[a-zA-Z0-9.]+$/.test(value) || "Adresse invalide.",
    duplicateInUsers: (value) => !props.library.users?.some(guest => guest.email === value + "@gmail.com") || "L'utilisateur est déjà ajouté.",
    duplicateInAdmins: (value) => !props.library.admins?.some(guest => guest.email === value + "@gmail.com") || "L'utilisateur est déjà ajouté en tant qu'administrateur.",
    length: (value) => (value?.length > 5 && value?.length < 31) || "L'adresse doit contenir entre 6 et 30 caractères",
}

function handleEmailInput() { //TODO reuse
    email.value = email.value.replace(/[^a-zA-Z0-9.]/g, '');
}

function send() {
    sending.value = true;
    addGuest(props.library.id, email.value + "@gmail.com")
        .then(library => {
            updatedLibrary.value = library;
            sent.value = true;
        })
        .catch(err => {
            sending.value = false;
            if (err.message.includes('[401]')) {
                globalEmitter.emit('401');
            } else if (err.message.includes('[403]')) {
                globalEmitter.emit('403');
            } else if (err.message.includes('[404]')) {
                globalEmitter.emit('404');
            } else if (err.message.includes('[400]')) {
                globalEmitter.emit('error', { message: "Hmm... Il semblerait qu'un ou plusieurs paramètres soient invalides, veuillez réessayer..." });
            } else if (err.message.includes('[409]')) {
                globalEmitter.emit('error', { message: "Il semblerait que l'utilisateur soit déjà ajouté." });
            } else if (err.message.includes('[500]')) {
                globalEmitter.emit('error', { message: "Oups! Une erreur s'est produite du côté du serveur..." });
            } else {
                globalEmitter.emit('error', { message: "Oups! Une erreur inattendue s'est produite..." });
            }
        });
}

function reset() {
    email.value = "";
    sending.value = false;
    sent.value = false;
}

function cancel() {
    reset();
    emit('cancel');
}

function update() {
    reset();
    emit('update', updatedLibrary.value);
}
</script>