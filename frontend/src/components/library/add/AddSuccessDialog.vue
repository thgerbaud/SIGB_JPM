<template>
    <v-dialog persistent width="800">
        <v-card title="Livre ajouté">
            <template v-slot:prepend>
                <v-icon icon="mdi-check-circle" color="primary"></v-icon>
            </template>
            <v-card-text>
                Votre livre <b>"{{ title }}"</b> a bien été ajouté à votre bibliothèque ({{ nbCopies }}  exemplaire(s) au total) !
                Que voulez-vous faire maintenant ?
            </v-card-text>
            <v-card-actions>
                <v-btn class="flex-grow-1" @click="$emit('goHome')">Revenir à l'accueil</v-btn>
                <v-btn-secondary class="flex-grow-1" @click="$emit('addAnother')">Ajouter un autre livre</v-btn-secondary>
                <v-btn variant="flat" class="flex-grow-1"  @click="$emit('seeBook')">Voir le livre</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: ["nbCopies", "title"]
}
</script>