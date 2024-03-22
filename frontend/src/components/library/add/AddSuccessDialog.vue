<template>
    <v-dialog persistent width="800">
        <v-card title="Livre ajouté">
            <template v-slot:prepend>
                <v-icon icon="mdi-check-circle" color="primary"></v-icon>
            </template>
            <v-card-text>
                Votre livre <b>"{{ props.title }}"</b> a bien été ajouté à votre bibliothèque ({{ props.nbCopies }}  exemplaire(s) au total) !
                Que voulez-vous faire maintenant ?
            </v-card-text>
            <v-card-actions class="flex-column flex-md-row align-stretch">
                <v-btn class="flex-grow-1 mb-2" @click="goHome">Revenir à l'accueil</v-btn>
                <v-btn-secondary class="flex-grow-1 mb-2" @click="addAnother">Ajouter un autre livre</v-btn-secondary>
                <v-btn variant="flat" class="flex-grow-1"  @click="seeBook">Voir le livre</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
const props = defineProps(["nbCopies", "title"]);
const emit = defineEmits(["goHome", "addAnother", "seeBook"]);

function goHome() {
    emit('goHome');
}

function addAnother() {
    emit('addAnother');
}

function seeBook() {
    emit('seeBook');
}
</script>
