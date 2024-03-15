<template>
    <h2 class="text-h2">{{ book.details?.title }}</h2>
    <h5 class="text-h5 mb-4">{{ book.details?.authors?.join(", ") }}</h5>

    <p class="text-justify mb-4">{{ book.details?.description }}</p>

    <legend><span class="font-weight-bold">Date de publication :</span> {{
        book.details?.publication }}
    </legend>
    <legend><span class="font-weight-bold">N° ISBN :</span> {{ book.isbn }}</legend>
    <legend><span class="font-weight-bold">Catégorie(s) :</span> {{ categoriesToString }}</legend>
    <legend><span class="font-weight-bold">Exemplaires :</span> {{ book.copies?.length }}</legend>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps(["book", "library"]);

const categoriesToString = computed(() => {
    const categoriesNames = findCategoriesName(props.library.categories);
    if (categoriesNames.length > 0) {
        return categoriesNames.join(', ');
    } else {
        return "Aucune";
    }
});

function findCategoriesName(categories) {
    let res = [];
    categories.forEach(category => {
        if (props.book.categories?.includes(category.id)) {
            res.push(category.name);
        }
        if (category.subcategories) {
            res = res.concat(findCategoriesName(category.subcategories));
        }
    });
    return res;
}
</script>