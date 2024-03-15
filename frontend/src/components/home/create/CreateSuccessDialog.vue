<template>
    <v-dialog persistent width="500">
        <v-card title="Bibliothèque créée">
            <template v-slot:prepend>
                <v-icon icon="mdi-check-circle" color="primay"></v-icon>
            </template>
            <v-card-text>
                Votre bibliothèque "{{ name }}" a bien été créée ! Vous allez maintenant pouvoir y ajouter vos livres...
            </v-card-text>
            <v-card-actions>
                <v-btn variant="flat" class="flex-grow-1"  @click="router.push(`/${id}/books`)">Y aller</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { useRouter} from 'vue-router';

defineProps(["id", "name"]);
const router = useRouter();
</script>