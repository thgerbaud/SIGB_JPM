<template>
    <v-dialog persistent width="800">
        <v-card prepend-icon="mdi-book-edit-outline" title="Modifier l'exemplaire">
            <v-card-item>
                <p class="mb-4">Modifiez le code et/ou l'emplacement de votre exemplaire.</p>
                <v-form v-model="isFormValid" @submit.prevent>
                    <v-text-field label="Code" variant="outlined" v-model="newCode" clearable
                        hint="Choisissez un code unique pour identifier votre exemplaire"
                        :rules="[rules.required, rules.code]" persistent-hint maxlength="10"
                        @input="handleCodeInput(index)"></v-text-field>
                    <v-select label="Emplacement" variant="outlined" :items="locationItems" v-model="newLocation" clearable
                        hint="(optionnel)" persistent-hint></v-select>
                </v-form>
            </v-card-item>
            <v-card-actions>
                <v-btn-secondary @click="cancel" color="error" class="flex-grow-1">Annuler</v-btn-secondary>
                <v-btn variant="flat" class="flex-grow-1" :disabled="!isFormValid || !isDifferent" :loading="loading"
                    @click="save">Enregistrer</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import BookDataService from '@/services/BookDataService';
export default {
    props: ["copy", "library", "bookId"],
    data() {
        return {
            newCode: this.copy?.code,
            newLocation: this.copy?.location,
            rules: {
                required: (value) => !!value || "Champ obligatoire.",
                code: (value) => (/^[a-zA-Z0-9]+$/.test(value)) || "Ne doit contenir que des chiffres et des lettres."
            },
            loading: false,
            isFormValid: false,
        }
    },
    computed: {
        locationItems() {
            let items = this.library.locations.map((title, value) => ({ title, value }));
            items.unshift({ title: "Non précisé", value: null });
            return items;
        },
        isDifferent() {
            return (this.newCode !== this.copy?.code) || (this.newLocation !== this.copy?.location);
        }
    },
    watch: {
        copy() {
            this.reset();
        }
    },
    methods: {
        handleCodeInput() {
            this.newCode = this.newCode.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        },
        reset() {
            this.newCode = this.copy?.code;
            this.newLocation = this.copy?.location;
        },
        cancel() {
            this.reset();
            this.$emit('cancel');
        },
        save() {
            this.loading = true;
            const payload = {};
            if (this.newCode !== this.copy?.code) {
                payload.code = this.newCode;
            }
            if (this.newLocation !== this.copy?.location) {
                payload.location = this.newLocation;
            }
            BookDataService.updateCopy(this.bookId, this.copy.id, payload)
                .then(updatedBook => {
                    this.$emit('update', updatedBook);
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
    emits: ['cancel', 'update']
}
</script>