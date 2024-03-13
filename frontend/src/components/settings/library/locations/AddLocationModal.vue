<template>
    <v-dialog width="500" persistent>
        <v-card title="Ajouter un emplacement">
            <template v-slot:prepend>
                <v-icon icon="mdi-map-marker-plus" color="primary"></v-icon>
            </template>
            <v-card-text>
                <v-form v-model="isFormValid">
                    <legend>Entrez le nom du nouvel emplacement :</legend>
                    <v-text-field label="Nom" class="mt-4" v-model="name" variant="outlined" clearable
                        :rules="[rules.required, rules.duplicate]"></v-text-field>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-btn color="error" class="flex-grow-1" @click="cancel">Annuler</v-btn>
                <v-btn class="flex-grow-1" @click="add" :disabled="!isFormValid" :loading="loading">Ajouter</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { addLocation } from '@/services/LibraryDataService';
export default {
    props: ["library"],
    data() {
        return {
            name: "",
            isFormValid: false,
            loading: false,
            rules: {
                required: (value) => !!value?.trim() || "Le nom ne doit pas être vide.",
                duplicate: (value) => !this.library.locations?.find(location => location.name === value?.trim()) || "Un emplacement avec ce nom existe déjà.",
            },
        }
    },
    methods: {
        cancel() {
            this.name = "";
            this.$emit('cancel');
        },
        add() {
            this.loading = true;
            addLocation(this.library.id, this.name)
                .then(library => {
                    this.$emit('update', library);
                    this.name = "";
                    this.loading = false;
                })
                .catch(err => {
                    this.loading = false;
                    if (err.message.includes('[401]')) {
                        this.globalEmitter.emit('401');
                    } else if (err.message.includes('[403]')) {
                        this.globalEmitter.emit('403');
                    } else if (err.message.includes('[404]')) {
                        this.globalEmitter.emit('404');
                    } else if (err.message.includes('[400]')) {
                        this.globalEmitter.emit('error', { message: "Hmm... Il semblerait qu'un ou plusieurs paramètres soient invalides, veuillez réessayer..." });
                    } else if (err.message.includes('[409]')) {
                        this.globalEmitter.emit('error', { message: "Il semblerait que vous ayez déjà un emplacement avec ce nom." });
                    } else if (err.message.includes('[500]')) {
                        this.globalEmitter.emit('error', { message: "Oups! Une erreur s'est produite du côté du serveur..." });
                    } else {
                        this.globalEmitter.emit('error', { message: "Oups! Une erreur inattendue s'est produite..." });
                    }
                });
        },
    },
    emits: ["cancel", "update"],
}
</script>