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
                <v-btn-secondary @click="$emit('cancel')" color="error" class="flex-grow-1">Annuler</v-btn-secondary>
                <v-btn variant="flat" @click="save" class="flex-grow-1" :disabled="!isFormValid">Enregistrer</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: ["book", "library"],
    data() {
        return {
            isFormValid: false,
            newCategories: this.book.categories
        };
    },
    computed: {
        //TODO setup réutiliser bout de code pour editBook
        categoriesSelectItems() {
            const flattenCategories = (categories, depth, parents) => {
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
            return flattenCategories(this.library.categories, 0, []);
        }
    },
    methods: {
        save() {
            if (this.isFormValid) {
                const data = { categories: this.newCategories };
                this.$emit('save', data);
            }
        },
        addParents(parents) {
            parents.forEach(id => {
                if (!this.newCategories.includes(id)) {
                    this.newCategories.push(id);
                }
            });
        },
        removeChildrens(id) {
            const childrens = this.categoriesSelectItems
                .filter(category => category.props.parents?.includes(id))
                .map(category => category.value);
            this.newCategories = this.newCategories.filter(id => !childrens.includes(id));
        },
    },
    emits: ["cancel", "save"]
}
</script>