<template>
    <v-dialog persistent width="500">
        <v-card title="Modifier le livre">
            <template v-slot:prepend>
                <v-icon icon="mdi-pencil" color="primary"></v-icon>
            </template>
            <v-card-item>
                <v-form class="my-2" @submit.prevent v-model="isFormValid">
                    <v-select label="Catégories" variant="outlined" multiple clearable hint="(optionnel)" persistent-hint
                        :items="categoriesSelectItems" v-model="newCategories">
                        <template #item="data">
                            <v-divider v-if="data.props.depth === 0"></v-divider>
                            <v-list-item v-bind="data.props">
                                <template v-slot:prepend="{ isActive }">
                                    <v-list-item-action start :class="`ml-${data.props.depth * 8}`">
                                        <v-checkbox-btn :model-value="isActive"
                                            @change="isActive ? addParents(data.props.parents) : removeChildrens(data.item.value)"></v-checkbox-btn>
                                    </v-list-item-action>
                                </template>
                            </v-list-item>
                        </template>
                    </v-select>
                </v-form>
            </v-card-item>
            <v-card-actions>
                <v-btn-secondary @click="emit('cancel')" color="error" class="flex-grow-1">Annuler</v-btn-secondary>
                <v-btn variant="flat" @click="save" class="flex-grow-1" :disabled="!isFormValid">Enregistrer</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps(["book", "library"]);
const emit = defineEmits(["cancel", "save"]);

const isFormValid = ref(false);
const newCategories = ref(props.book.categories);

const categoriesSelectItems = computed(() => { //TODO reuse this editBook
    const flattenCategories = (categories, depth, parents) => { //TODO compare with utils
        let result = [];

        categories.forEach(category => {
            result.push({ value: category.id, title: category.name, props: { depth, parents } });

            if (category.subcategories) {
                let parentsCopy = [...parents];
                parentsCopy.push(category.id);
                result = result.concat(flattenCategories(category.subcategories, depth + 1, parentsCopy));
            }
        });

        return result;
    }
    return flattenCategories(props.library.categories, 0, []);
});

function save() {
    if (isFormValid.value) {
        const data = { categories: newCategories.value };
        emit('save', data);
    }
}

function addParents(parents) {
    parents.forEach(id => {
        if (!newCategories.value.includes(id)) {
            newCategories.value.push(id);
        }
    });
}

function removeChildrens(id) {
    const childrens = categoriesSelectItems.value
        .filter(category => category.props.parents?.includes(id))
        .map(category => category.value);
    newCategories.value = newCategories.value.filter(id => !childrens.includes(id));
}
</script>