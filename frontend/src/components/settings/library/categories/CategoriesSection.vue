<template>
    <SettingsSectionTemplate title="Catégories">
        <template #content>
            <!-- Catégorie principale (niv. 1) -->
            <v-list v-if="library.categories?.length > 0" density="compact">
                <div v-for="category in library.categories" :key="category.id">
                    <CategoryListItem :category="category" :library="library" @update="update" />

                    <!-- Sous-catégories (niv. 2) -->
                    <v-list v-if="category.subcategories" density="compact" class="border-left ml-8">
                        <div v-for="subcategory in category.subcategories" :key="subcategory.id">
                            <CategoryListItem :category="subcategory" :library="library" @update="update" />

                            <!-- Sous-catégories (niv. 3) -->
                            <v-list v-if="subcategory.subcategories" density="compact" class="border-left ml-8">
                                <div v-for="subsubcategory in subcategory.subcategories" :key="subsubcategory.id">
                                    <CategoryListItem :category="subsubcategory" :library="library" @update="update" />
                                </div>
                                <v-list-item>
                                    <v-btn prepend-icon="mdi-plus" class="pa-0" variant="text" density="compact"
                                        @click="openModal(subcategory)">Ajouter
                                        une sous-catégorie</v-btn>
                                </v-list-item>
                            </v-list>
                            <!-- Fin sous-catégories niv. 3 -->
                        </div>
                        <v-list-item>
                            <v-btn prepend-icon="mdi-plus" class="pa-0" variant="text" density="compact"
                                @click="openModal(category)">Ajouter une
                                sous-catégorie</v-btn>
                        </v-list-item>
                    </v-list>
                    <!-- Fin sous-catégories niv. 2 -->
                </div>
            </v-list>
            <!-- Fin sous-catégories niv. 1 -->
            <p v-else class="font-italic">Aucune catégorie pour le moment</p>
            <v-snackbar color="primary" timeout="3000" v-model="updatedSnackbar">
                <v-icon icon="mdi-check-circle-outline"></v-icon>
                Catégories mises à jour.
            </v-snackbar>
        </template>

        <template #actions>
            <v-btn prepend-icon="mdi-plus" class="mt-2" @click="openModal()">Ajouter une catégorie</v-btn>
            <AddCategoryModal v-model="addCategoryModal" :library="library" :parent="parentCategory" @cancel="closeModal"
                @update="(library) => { closeModal(); update(library) }" />
        </template>
    </SettingsSectionTemplate>
</template>

<script setup>
import { ref } from 'vue';
import { useLibraryStore } from '@/store/library';
import SettingsSectionTemplate from '@/components/settings/SettingsSectionTemplate.vue';
import CategoryListItem from '@/components/settings/library/categories/CategoryListItem.vue';
import AddCategoryModal from '@/components/settings/library/categories/AddCategoryModal.vue';

defineProps(["library"]);

const libraryStore = useLibraryStore();

const addCategoryModal = ref(false);
const parentCategory = ref(null);
const updatedSnackbar = ref(false);

function openModal(parent = null) {
    parentCategory.value = parent;
    addCategoryModal.value = true;
}

function closeModal() {
    addCategoryModal.value = false;
}

function update(library) {
    libraryStore.setLibrary(library);
    updatedSnackbar.value = true;
}
</script>

<style scoped>
.border-left {
    border-left: 1px solid black;
}
</style>