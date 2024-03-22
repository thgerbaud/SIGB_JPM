<template>
    <ExpiredSessionDialog v-model="expiredSessionDialog" />

    <ErrorDialog v-model="errorDialog" @close="errorDialog = false" :message="errorMessage" />

    <SectionTemplate title="Mes bibliothèques :">
        <!-- <h2 class="text-h4 text-sm-h3 text-md-h2 mb-4">Mes bibliothèques :</h2> -->

        <v-list class="pa-0 bg-transparent">
            <div v-if="loading">
                <v-skeleton-loader class="bg-primary-lighten-1 mb-3 rounded-lg" type="list-item-two-line" v-for="n in 3"
                    :key="n"></v-skeleton-loader>
            </div>
            <div v-else-if="errorMet" class="font-italic text-disabled ma-4 text-center">
                <v-icon icon="mdi-server-off" size="x-large" class="mb-4"></v-icon>
                <p>
                    Impossible de récupérer vos bibliothèques.
                    Essayez de rafaîchir la page, si l'erreur persiste veuillez réessayer plus tard.
                </p>
            </div>
            <p v-else-if="!libraries || libraries.length === 0" class="font-italic text-disabled ma-4 text-center">
                Vous n'avez aucune bibliothèque pour le moment. Créez votre première bibliothèque ou acceptez un lien
                d'invitation pour en rejoindre une.
            </p>
            <LibraryListItem v-for="(library, index) in libraries" :key="index" :library="library" v-else />
            <CreateButton />
        </v-list>
    </SectionTemplate>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAll } from '@/services/LibraryDataService';
import SectionTemplate from '@/components/utils/SectionTemplate.vue';
import LibraryListItem from '@/components/home/LibraryListItem.vue';
import CreateButton from '@/components/home/CreateButton.vue';
import ExpiredSessionDialog from '@/components/utils/dialogs/ExpiredSessionDialog.vue';
import ErrorDialog from '@/components/utils/dialogs/ErrorDialog';

const loading = ref(false);
const libraries = ref([]);
const expiredSessionDialog = ref(false);
const errorDialog = ref(false);
const errorMessage = ref("Oups! une erreur s'est produite...");
const errorMet = ref(false);

const retrieveLibraries = async () => {
    loading.value = true;
    try {
        const response = await getAll();
        libraries.value = response ?? [];
        loading.value = false;
    } catch (err) {
        if (err.message.includes(401)) {
            expiredSessionDialog.value = true;
        } else if (err.message.includes(500)) {
            errorMessage.value = "Oups! Une erreur s'est produite du côté du serveur...";
            errorDialog.value = true;
        } else {
            errorMessage.value = "Oups! Une erreur inattendue s'est produite...";
            errorDialog.value = true;
        }
        loading.value = false;
        errorMet.value = true;
    }
};

onMounted(() => {
    retrieveLibraries();
});
</script>