<template>
    <v-form class="pb-4" v-model="isFormValid" ref="categoriesForm">
        <div v-for="(category, i) in categories" :key="category">
            <!-- Catégorie principale (niv. 1) -->
            <v-row class="mt-4">
                <v-col class="py-0">
                    <v-text-field v-model="category.name" :label="`Catégorie ${i + 1}`" variant="outlined" clearable
                        density="compact" placeholder="Ex: Fiction"
                        :rules="[rules.required, rules.duplicate(category)]"></v-text-field>
                </v-col>
                <v-col cols="1" class="py-0">
                    <v-btn variant="plain" icon="mdi-close-circle" color="error" @click="removeCategory(i)"></v-btn>
                </v-col>
            </v-row>
            <!-- Sous-catégories (niv. 2) -->
            <div v-for="(subcategory, j) in category.subcategories" :key="subcategory">
                <v-row :class="{ 'mt-4' : j > 0}">
                    <v-col cols="1">
                        <v-icon icon="mdi-subdirectory-arrow-right"></v-icon>
                    </v-col>
                    <v-col class="py-0">
                        <v-text-field v-model="subcategory.name" :label="`Sous-catégorie ${i + 1}.${j + 1}`"
                            variant="outlined" clearable density="compact" placeholder="Ex: Roman"
                            :rules="[rules.required, rules.duplicate(subcategory)]"></v-text-field>
                    </v-col>
                    <v-col cols="1" class="py-0">
                        <v-btn variant="plain" icon="mdi-close-circle" color="error"
                            @click="removeSubcategory(i, j)"></v-btn>
                    </v-col>
                </v-row>
                <!-- Sous-catégories (niv. 3)-->
                <div v-for="(subsubcategory, k) in subcategory.subcategories" :key="subsubcategory">
                    <v-row>
                        <v-col cols="2" class="text-right">
                            <v-icon icon="mdi-subdirectory-arrow-right"></v-icon>
                        </v-col>
                        <v-col class="py-0">
                            <v-text-field v-model="subsubcategory.name" :label="`Sous-catégorie ${i + 1}.${j + 1}.${k + 1}`"
                                variant="outlined" clearable density="compact" placeholder="Ex: Roman policier"
                                :rules="[rules.required, rules.duplicate(subsubcategory)]"></v-text-field>
                        </v-col>
                        <v-col cols="1" class="py-0">
                            <v-btn variant="plain" icon="mdi-close-circle" color="error"
                                @click="removeSubsubcategory(i, j, k)"></v-btn>
                        </v-col>
                    </v-row>
                </div>
                <v-row>
                    <v-col cols="2" class="py-0"></v-col>
                    <v-col class="py-0">
                        <v-btn variant="plain" prepend-icon="mdi-plus" @click="addSubsubcategory(i, j)" class="mb-4"
                            density="compact">ajouter
                            une
                            sous-catégorie</v-btn>
                    </v-col>
                </v-row>

            </div>
            <!-- Fin sous-catégories niv. 3 -->
            <v-row>
                <v-col cols="1" class="py-0"></v-col>
                <v-col class="py-0">
                    <v-btn variant="plain" prepend-icon="mdi-plus" @click="addSubcategory(i)" class="mb-4"
                        density="compact">ajouter une
                        sous-catégorie</v-btn>
                </v-col>
            </v-row>
            <!-- Fin sous-catégories niv. 2 -->
        </div>
        <v-btn variant="plain" prepend-icon="mdi-plus" @click="addCategory" class="pl-0 mt-4" density="compact">ajouter une
            catégorie</v-btn>
        <!-- Fin catégories niv. 1 -->
    </v-form>

    <div class="d-flex justify-space-between">
        <v-btn-secondary @click="prev" prepend-icon="mdi-chevron-left" :disabled="!isFormValid">Précédent</v-btn-secondary>
        <v-btn-tertiary color="error" @click="$emit('cancel')">Annuler</v-btn-tertiary>
        <v-btn @click="setCategories" prepend-icon="mdi-check" :disabled="!isFormValid">Terminer</v-btn>
    </div>
</template>

<script>
export default {
    data() {
        return {
            categories: [],
            rules: {
                required: (value) => (!!value?.trim()) || "Le nom ne doit pas être vide.",
                duplicate: (category) => (value) => this.isNameUnique(value, category) || "Vous avez plusieurs catégories avec le même nom.",
                //TODO regex / length ?
            },
            isFormValid: true
        }
    },
    watch: {
        categories: {
            handler() {
                this.$refs.categoriesForm.validate();
            },
            deep: true
        }
    },
    methods: {
        addCategory() {
            this.categories.push({ name: "", subcategories: [] });
        },
        addSubcategory(i) {
            this.categories[i]?.subcategories.push({ name: "", subcategories: [] });
        },
        addSubsubcategory(i, j) {
            this.categories[i]?.subcategories[j]?.subcategories.push({ name: "" });
        },
        removeCategory(i) {
            this.categories.splice(i, 1);
        },
        removeSubcategory(i, j) {
            this.categories[i]?.subcategories.splice(j, 1);
        },
        removeSubsubcategory(i, j, k) {
            this.categories[i]?.subcategories[j]?.subcategories.splice(k, 1);
        },
        isNameUnique(value, currentCategory) {
            const testValue = value?.trim().toLowerCase();
            const checkUnique = (category) => {
                if (category.name?.trim().toLowerCase() === testValue && category !== currentCategory) {
                    return false;
                }
                if (category.subcategories) {
                    return category.subcategories.every(checkUnique);
                }
                return true;
            };
            return this.categories.every(checkUnique);
        },
        setCategories() {
            if (this.isFormValid) {
                this.$emit('next', this.categories);
            }
        },
        prev() {
            if (this.isFormValid) {
                this.$emit('prev');
            }
        }
    },
    emits: ["prev", "next", "cancel"]
}
</script>