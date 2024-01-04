<template>
    <v-dialog v-if="book" width="500" persistent>
        <v-card>
            <v-card-title class="bg-primary">
                Résultat pour l'isbn {{ book.isbn }} :
            </v-card-title>

            <div class="d-flex flex-no-wrap justify-space-between pa-4">
                <v-img :src="book.image" width="200"></v-img>
                <v-card-text>
                    <h2>{{ book.title }}</h2>
                    {{ book.authors.join(" ") }}
                </v-card-text>
            </div>

            <v-card-text>
                Cliquez sur "Ajouter" pour ajouter ce livre à votre bibliothèque.
            </v-card-text>

            <v-card-actions>
                <v-btn-cancel color="error" class="flex-grow-1" @click="$emit('close')" >Annuler</v-btn-cancel>
                <v-btn variant="flat" class="flex-grow-1" @click="$emit('add')">Ajouter</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: ["book"]
}
</script>