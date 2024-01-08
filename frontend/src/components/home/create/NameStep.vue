<template>
    <v-text-field v-model="libraryName" variant="outlined" :rules="[rules.notEmpty]"
        label="Nom de la bibliothèque" clearable></v-text-field>
    <div class="d-flex justify-space-between">
        <v-btn-tertiary color="error" @click="$emit('cancel')">Annuler</v-btn-tertiary>
        <v-btn :disabled="!libraryName?.trim()" @click="setName" append-icon="mdi-chevron-right">Suivant</v-btn>
    </div>
</template>

<script>
export default {
    data() {
        return {
            libraryName: "",
            rules: {
                notEmpty: (value) => (!!value?.trim()) || "Le nom ne doit pas être vide."
            }
        }
    },
    methods: {
        setName() {
            const name = this.libraryName?.trim();
            if(name) {
                this.libraryName = name;
                this.$emit('next', name);
            }
        }
    },
    emits: ["prev", "next", "cancel"]
}
</script>