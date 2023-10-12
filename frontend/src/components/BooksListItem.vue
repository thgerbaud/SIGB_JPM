<template>
    <div class="book-preview">
        <img :src="book.image" alt="couverture" class="book-cover">
        <legend class="book-title">
            {{ book.title }}
        </legend>
        <legend class="book-authors">
            {{ book.author.join(" ") }}
        </legend>
    </div>
</template>

<script>
export default {
    name: "books-list-item",
    props: ["book"]
}
</script>

<style scoped>
.book-cover {
	height: 200px;
}

.book-preview {
	width: 150px;
}

.book-title {
	color: var(--text-color);
	font-weight: bold;
}

.book-authors {
	color: var(--label-color);
}
</style>