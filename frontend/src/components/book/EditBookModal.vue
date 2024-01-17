<template>
    <v-dialog persistent width="500">
        <v-card title="Modifier le livre">
            <template v-slot:prepend>
                <v-icon icon="mdi-pencil" color="primary"></v-icon>
            </template>
            <v-card-item>
                <v-form class="my-2" @submit.prevent v-model="isFormValid">
                    <v-text-field label="Code" variant="outlined" v-model="newCode" clearable
                        hint="Choisissez un code unique pour identifier votre livre" :rules="[rules.required, rules.code]"
                        persistent-hint maxlength="10" @input="handleCodeInput"></v-text-field>
                    <v-select label="Localisation" variant="outlined"
                        :items="library.locations.map((title, value) => ({ title, value }))" v-model="newLocation" clearable
                        hint="(optionnel)" persistent-hint></v-select>
                    <v-select label="Catégorie" variant="outlined"
                        :items="library.categories.map((title, value) => ({ title, value }))" v-model="newCategory"
                        clearable hint="(optionnel)" persistent-hint></v-select>
                </v-form>
            </v-card-item>
            <v-card-actions class="d-flex">
                <v-btn-secondary @click="$emit('cancel')" color="error" class="flex-grow-1">Annuler</v-btn-secondary>
                <v-btn variant="flat" @click="save" class="flex-grow-1"
                    :disabled="!isFormValid">Enregistrer</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: ["book", "library"],
    data() {
        return {
            rules: {
                required: (value) => !!value || "Champ obligatoire.",
                code: (value) => (/^[a-zA-Z0-9]+$/.test(value)) || "Ne doit contenir que des chiffres et des lettres."
            },
            isFormValid: false,
            newCode: this.book.code,
            newLocation: this.book.location,
            newCategory: this.book.category
        };
    },
    methods: {
        handleCodeInput() {
            this.newCode = this.newCode.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        },
        save() {
            if (this.isFormValid) {
                let data = {};
                if (this.newCode !== this.book.code) {
                    data.code = this.newCode;
                }
                if (this.newLocation !== this.book.location) {
                    data.location = this.newLocation;
                }
                if (this.newCategory !== this.book.category) {
                    data.category = this.newCategory;
                }
                this.$emit('save', data);
            }
        }
    },
    emits: ["cancel", "save"]
}
</script>