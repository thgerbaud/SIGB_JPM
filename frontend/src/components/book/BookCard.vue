<template>
    <v-card class="d-flex" variant="flat">
        <div class="flex-grow-1">
            <v-card-item>
                <v-card-text class="text-body-1">
                    <h2 class="text-h2">{{ book.details.title }}</h2>
                    <h5 class="text-h5 mb-4">{{ book.details.authors.join(", ") }}</h5>

                    <p class="text-justify mb-4">{{ book.details.description }}</p>

                    <legend><span class="font-weight-bold">Date de publication :</span> {{ publicationToString }}
                    </legend>
                    <legend><span class="font-weight-bold">N° ISBN :</span> {{ book.isbn }}</legend>
                    <legend><span class="font-weight-bold">Code :</span> {{ book.code }}</legend>
                    <legend><span class="font-weight-bold">Catégorie :</span> {{ categoryToString }}</legend>
                    <legend><span class="font-weight-bold">Emplacement :</span> {{ locationToString }}</legend>

                </v-card-text>
            </v-card-item>
        </div>
        <div>
            <v-img :src="book.details.image" width="250"></v-img>
        </div>
    </v-card>
</template>

<script>
export default {
    props: ["book", "library"],
    computed: {
		locationToString() {
			const locationIndex = this.book.location ?? -1;
			if (locationIndex > this.library.locations.length || locationIndex < 0) {
					return "Non précisé"
			} else {
				return this.library.locations[locationIndex];
			}
		},
		categoryToString() {
			const categoryIndex = this.book.category ?? -1;
			if (categoryIndex > this.library.categories.length || categoryIndex < 0) {
					return "Aucune"
			} else {
				return this.library.categories[categoryIndex];
			}
		},
        publicationToString() {
            const date = new Date(this.book.details.publication);
            return date?.getFullYear();
        }
	},
}
</script>