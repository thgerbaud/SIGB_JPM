<template>
    <h2 class="text-h2">{{ book.details?.title }}</h2>
    <h5 class="text-h5 mb-4">{{ book.details?.authors?.join(", ") }}</h5>

    <p class="text-justify mb-4">{{ book.details?.description }}</p>

    <legend><span class="font-weight-bold">Date de publication :</span> {{
        book.details?.publication }}
    </legend>
    <legend><span class="font-weight-bold">N° ISBN :</span> {{ book.isbn }}</legend>
    <legend><span class="font-weight-bold">Catégorie :</span> {{ categoryToString }}</legend>
    <legend><span class="font-weight-bold">Exemplaires :</span> {{ book.copies?.length }}</legend>
</template>

<script>
export default {
    props: ["book", "library"],
    computed: {
        categoryToString() {
            const categoryIndex = this.book.category ?? -1;
            if (categoryIndex > this.library.categories.length || categoryIndex < 0) {
                return "Aucune"
            } else {
                return this.library.categories[categoryIndex];
            }
        }
    },
}
</script>