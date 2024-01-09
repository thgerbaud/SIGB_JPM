<template>
    <v-text-field v-model="categories[0]" label="Catégorie 1" variant="outlined" hint="(Optionnel) Ex.: ???" persistent-hint
        :rules="[rules.duplicate(0)]" clearable ref="input1" @input="validateInputs"></v-text-field>
    <v-text-field v-model="categories[1]" label="Catégorie 2" variant="outlined" hint="(Optionnel) Ex.: ???" persistent-hint
        :rules="[rules.duplicate(1)]" clearable ref="input2" @input="validateInputs"></v-text-field>
    <v-text-field v-model="categories[2]" label="Catégorie 3" variant="outlined" hint="(Optionnel) Ex.: ???" persistent-hint
        :rules="[rules.duplicate(2)]" clearable ref="input3" @input="validateInputs"></v-text-field>
    <div class="d-flex justify-space-between">
        <v-btn-secondary @click="prev" prepend-icon="mdi-chevron-left" :disabled="!isValid">Précédent</v-btn-secondary>
        <v-btn-tertiary color="error" @click="$emit('cancel')">Annuler</v-btn-tertiary>
        <v-btn @click="setCategories" prepend-icon="mdi-check" :disabled="!isValid">Terminer</v-btn>
    </div>
</template>

<script>
export default {
    data() {
        return {
            categories: ["", "", ""],
            rules: {
                duplicate: (index) => (value) => (!this.isDuplicate(value, index)) || "Vous avez plusieurs catégories avec le même nom."
            }
        }
    },
    computed: {
        isValid() {
            return !this.isDuplicate(this.categories[0], 0) && !this.isDuplicate(this.categories[1], 1);
        }
    },
    methods: {
        isDuplicate(v, i) {
            const value = v?.trim().toLowerCase();
            return (value) && (
                (value === this.categories[this.mod3(i - 1)]?.trim().toLowerCase())
                || (value === this.categories[this.mod3(i + 1)]?.trim().toLowerCase())
            );
        },
        mod3(i) {
            return (i % 3 + 3) % 3
        },
        validateInputs() {
            this.$refs.input1.validate();
            this.$refs.input2.validate();
            this.$refs.input3.validate();
        },
        sortFn(a, b) {
            if (b) {
                return 0
            } else {
                return -1
            }
        },
        setCategories() {
            if (this.isValid) {
                // si les catégories ne sont que partiellement renseignées, pousse les "trous" à la fin de la liste
                this.categories.sort(this.sortFn); 
                this.$emit('next', this.categories.map((category) => category || ""));
            }
        },
        prev() {
            if (this.isValid) {
                this.$emit('prev');
            }
        }
    },
    emits: ["prev", "next", "cancel"]
}
</script>