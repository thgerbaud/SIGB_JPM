<template>
    <v-form class="pb-4" v-model="isFormValid" ref="categoriesForm">
        <div v-if="categories.length === 0" class="py-2">
            <p class="font-italic text-disabled">Aucune catégorie...</p>
        </div>

        <!-- Catégories principales (niv. 1) -->
        <div v-for="(category, i) in categories" :key="category">
            <div class="d-flex">
                <v-text-field v-model="category.name" :label="`Catégorie ${i + 1}`" clearable density="compact"
                    placeholder="Ex: Fiction" :rules="[rules.required, rules.duplicate(category)]"></v-text-field>
                <v-btn variant="plain" icon="mdi-close-circle" color="error" @click="removeCategory(i)"></v-btn>
            </div>

            <!-- Sous-catégories (niv. 2) -->
            <div v-for="(subcategory, j) in category.subcategories" :key="subcategory">
                <div class="d-flex">
                    <v-icon icon="mdi-subdirectory-arrow-right"></v-icon>
                    <v-text-field v-model="subcategory.name" :label="`Sous-catégorie ${i + 1}.${j + 1}`" clearable
                        density="compact" placeholder="Ex: Roman"
                        :rules="[rules.required, rules.duplicate(subcategory)]"></v-text-field>
                    <v-btn variant="plain" icon="mdi-close-circle" color="error" @click="removeSubcategory(i, j)"></v-btn>
                </div>

                <!-- Sous-catégories (niv. 3)-->
                <div v-for="(subsubcategory, k) in subcategory.subcategories" :key="subsubcategory">
                    <div class="d-flex ml-4 ml-md-8">
                        <v-icon icon="mdi-subdirectory-arrow-right"></v-icon>
                        <v-text-field v-model="subsubcategory.name" :label="`Sous-catégorie ${i + 1}.${j + 1}.${k + 1}`"
                            clearable density="compact" placeholder="Ex: Roman policier"
                            :rules="[rules.required, rules.duplicate(subsubcategory)]"></v-text-field>
                        <v-btn variant="plain" icon="mdi-close-circle" color="error"
                            @click="removeSubsubcategory(i, j, k)"></v-btn>
                    </div>
                </div>
                <!-- Fin sous-catégories niv. 3 -->

                <v-btn variant="plain" prepend-icon="mdi-plus" @click="addSubsubcategory(i, j)" class="mb-4 ml-4 ml-md-8"
                    density="compact">ajouter une sous-catégorie</v-btn>
            </div>
            <!-- Fin sous-catégories niv. 2 -->

            <v-btn variant="plain" prepend-icon="mdi-plus" @click="addSubcategory(i)" class="mb-4" density="compact">ajouter
                une sous-catégorie</v-btn>
        </div>
        <!-- Fin catégories niv. 1 -->

        <v-btn variant="plain" prepend-icon="mdi-plus" @click="addCategory" class="pl-0 mt-4" density="compact">ajouter une
            catégorie</v-btn>
    </v-form>

    <div class="d-flex flex-column flex-md-row justify-space-between">
        <v-btn-secondary @click="prev" prepend-icon="mdi-chevron-left" :disabled="!isFormValid">Précédent</v-btn-secondary>
        <v-btn-tertiary color="error" @click="emit('cancel')">Annuler</v-btn-tertiary>
        <v-btn @click="setCategories" prepend-icon="mdi-check" :disabled="!isFormValid">Terminer</v-btn>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const emit = defineEmits(["prev", "next", "cancel"]);

const categories = ref([]);
const isFormValid = ref(true);
const categoriesForm = ref(null);

const rules = {
    required: (value) => (!!value?.trim()) || "Le nom ne doit pas être vide.",
    duplicate: (category) => (value) => isNameUnique(value, category) || "Vous avez plusieurs catégories avec le même nom."
    //TODO regex / length ?
};

function addCategory() {
    categories.value.push({ name: "", subcategories: [] });
}

function addSubcategory(i) {
    categories.value[i]?.subcategories.push({ name: "", subcategories: [] });
}

function addSubsubcategory(i, j) {
    categories.value[i]?.subcategories[j]?.subcategories.push({ name: "" });
}

function removeCategory(i) {
    categories.value.splice(i, 1);
}

function removeSubcategory(i, j) {
    categories.value[i]?.subcategories.splice(j, 1);
}

function removeSubsubcategory(i, j, k) {
    categories.value[i]?.subcategories[j]?.subcategories.splice(k, 1);
}

function isNameUnique(value, currentCategory) {
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
    return categories.value.every(checkUnique);
}

function setCategories() {
    if (isFormValid.value) {
        emit('next', categories.value);
    }
}

function prev() {
    if (isFormValid.value) {
        emit('prev');
    }
}

watch(categories, () => {
    categoriesForm.value.validate();
}, { deep: true });
</script>
