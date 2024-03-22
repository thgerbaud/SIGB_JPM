<template>
    <SectionTemplate class="d-md-flex">
        <div class="order-md-last">
            <v-img :src="book.details?.image" class="w-auto" min-width="250"></v-img>
        </div>
        <div class="flex-grow-1 mr-md-4">
            <h2 class="text-h4 text-sm-h3 text-md-h2">{{ book.details?.title }}</h2>
            <h5 class="text-h5 mb-4">{{ book.details?.authors?.join(", ") }}</h5>

            <div class="d-flex align-center mb-4" v-if="averageRating">
                <v-rating v-model="averageRating" density="compact" readonly half-increments></v-rating>
                ({{ averageRating }}/5)
            </div>
            <p class="mb-4 font-italic text-disabled" v-else>Aucun avis</p>

            <p class="text-justify mb-4">{{ book.details?.description }}</p>

            <legend><span class="font-weight-bold">Date de publication :</span> {{
                book.details?.publication }}
            </legend>
            <legend><span class="font-weight-bold">N° ISBN :</span> {{ book.isbn }}</legend>
            <legend><span class="font-weight-bold">Catégorie(s) :</span> {{ categoriesToString }}</legend>
        </div>
    </SectionTemplate>
</template>

<script setup>
import { computed } from 'vue';
import SectionTemplate from '@/components/utils/SectionTemplate.vue';

const props = defineProps(["book", "library"]);

const averageRating = computed(() => {
    const length = props.book.comments.length;
    if (length > 0) {
        const total = props.book.comments.reduce((accumulator, comment) => accumulator + comment.rating, 0);
        return (total / length).toFixed(1);
    } else {
        return null
    }
})

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