<template>
    <v-dialog persistent width="800">
        <v-card title="Ajouter un exemplaire">
            <template v-slot:prepend>
                <v-icon icon="mdi-book-plus-outline" color="primary"></v-icon>
            </template>
            <v-card-item>
                <p class="mb-2">
                    Indiquez un code unique pour référencer votre nouvel exemplaire.<br>
                    Vous pouvez également indiquer son emplacement pour aider vos usagers à le trouver.
                </p>
                <v-form v-model="isFormValid" @submit.prevent>
                    <v-text-field label="Code" variant="outlined" v-model="code" clearable
                        hint="Choisissez un code unique pour identifier votre exemplaire"
                        :rules="[rules.required, rules.code]" persistent-hint maxlength="10"
                        @input="handleCodeInput(index)"></v-text-field>
                    <v-select label="Emplacement" variant="outlined"
                        :items="locationItems" v-model="location" clearable
                        hint="(optionnel)" persistent-hint></v-select>
                </v-form>
            </v-card-item>
            <v-card-actions>
                <v-btn-cancel class="flex-grow-1" @click="$emit('cancel')">Annuler</v-btn-cancel>
                <v-btn variant="flat" class="flex-grow-1" :loading="loading" @click="saveCopy"
                    :disabled="!isFormValid">Ajouter</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import BookDataService from '@/services/BookDataService';
export default {
    props: ["library", "bookId"],
    data() {
        return {
            code: "",
            location: null,
            rules: {
                required: (value) => !!value || "Champ obligatoire.",
                code: (value) => (/^[a-zA-Z0-9]+$/.test(value)) || "Ne doit contenir que des chiffres et des lettres."
            },
            loading: false,
            isFormValid: false
        }
    },
    computed: {
        locationItems() {
            let items = this.library.locations.map(({name, id}) => ({ title : name, value: id }));
            items.unshift({ title: "Non précisé", value: null });
            return items;
        }
    },
    methods: {
        handleCodeInput() {
            this.code = this.code.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        },
        saveCopy() {
            this.loading = true;
            const payload = { code: this.code, location: this.location };
            BookDataService.addCopy(this.bookId, payload)
                .then(book => {
                    this.$emit('update', book);
                })
                .catch(err => {
                    if (err.message.includes('[401]')) {
                        this.globalEmitter.emit('401');
                    } else if (err.message.includes('[403]')) {
                        this.globalEmitter.emit('403');
                    } else if (err.message.includes('[404]')) {
                        this.globalEmitter.emit('404');
                    } else if (err.message.includes('[400]')) {
                        const errorMessage = err.message.includes("Duplicate") ? "Il semblerait que vous ayez déjà un livre identifié avec ce code. Veuillez choisir un code unique pour votre exemplaire et réessayez..." : "Hmm... Il semblerait qu'un ou plusieurs paramètres soient invalides, veuillez réessayer...";
                        this.globalEmitter.emit('error', { message: errorMessage });
                    } else if (err.message.includes('[500]')) {
                        this.globalEmitter.emit('error', { message: "Oups! Une erreur s'est produite du côté du serveur..." });
                    } else {
                        this.globalEmitter.emit('error', { message: "Oups! Une erreur inattendue s'est produite..." });
                    }
                })
                .finally(() => {
                    this.loading = false;
                });
        }
    },
    emits: ["update", "cancel"]
}
</script>