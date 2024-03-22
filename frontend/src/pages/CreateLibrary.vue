<template>
    <ConfirmDialog v-model="cancelDialog" title="Annuler la création"
        text="Annuler la création et quitter la page ? Les données entrées seront perdues." okText="Continuer la création"
        @ok="cancelDialog = false" cancelText="Quitter" @cancel="router.push('/home/libraries/')" />

    <CreateSuccessDialog v-model="successDialog" :id="id" :name="library.name" />

    <ErrorDialog v-model="errorDialog" @close="errorDialog = false" :message="errorMessage" />

    <v-container class="ma-0 ma-md-auto">
        <h2 class="text-h4 text-sm-h3 text-md-h2 text-md-center mb-8">Créer une nouvelle bibliothèque</h2>

        <v-stepper :model-value="currentStep" :mobile="!mdAndUp">
            <v-stepper-header>
                <StepperHeaderItem v-for="(step, index) in steps" :title="step.name" :value="index + 1"
                    :current-step="currentStep" :is-last="index + 1 === steps.length" />
            </v-stepper-header>

            <v-stepper-window>
                <v-stepper-window-item v-for="(step, index) in steps" :key="index" :value="index + 1">
                    <h4 class="text-h5 text-sm-h4 mb-4">{{ step.name }}</h4>
                    <p v-for="(legend, index) in step.legends" :key="index" class="text-justify mb-2">{{ legend }}</p>
                    <component :is="step.component" @prev="step.prev" @next="step.next" @cancel="cancelDialog = true" />
                </v-stepper-window-item>
            </v-stepper-window>
        </v-stepper>
    </v-container>
</template>
  
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { create } from '@/services/LibraryDataService';
import { useDisplay } from 'vuetify';
import StepperHeaderItem from '@/components/home/create/StepperHeaderItem.vue';
import NameStep from '@/components/home/create/NameStep.vue';
import LocationsStep from '@/components/home/create/LocationsStep.vue';
import CategoriesStep from '@/components/home/create/CategoriesStep.vue';
import ConfirmDialog from '@/components/utils/dialogs/ConfirmDialog.vue';
import CreateSuccessDialog from '@/components/home/create/CreateSuccessDialog.vue';
import ErrorDialog from '@/components/utils/dialogs/ErrorDialog';

const router = useRouter();
const { mdAndUp } = useDisplay();

const steps = [
    {
        name: "Nom",
        component: NameStep,
        legends: ["Choisissez un nom pour votre bibliothèque :"],
        prev: () => { },
        next: setName
    },
    {
        name: "Emplacements",
        component: LocationsStep,
        legends: [
            "Indiquez les différente emplacements (salles, meubles, bâtiments...) dans lesquels se trouvent vos livres afin d'indiquer à vos utilisateurs où les trouver.",
            "Si tous vos livres sont situés au même endroit vous pouvez passer directement à l'étape suivante.",
            "(Vous pourrez modifier les emplacements plus tard dans les paramètres de la bibliothèque.)"
        ],
        prev: prevStep,
        next: setLocations
    },
    {
        name: "Catégories",
        component: CategoriesStep,
        legends: [
            "Vous pouvez indiquer des catégories et sous-catégories (jusqu'à 3 niveaux) pour classer vos livres.",
            "(Vous pourrez modifier les catégories plus tard dans les paramètres de la bibliothèque.)"
        ],
        prev: prevStep,
        next: setCategories
    }
];
const currentStep = ref(1);
const successDialog = ref(false);
const cancelDialog = ref(false);
const errorDialog = ref(false);
const errorMessage = ref("Oups! une erreur s'est produite...");
const library = ref({
    name: "",
    locations: [],
    categories: []
});
const id = ref("");

function nextStep() {
    if (currentStep.value < steps.length) {
        currentStep.value++;
    }
}

function prevStep() {
    if (currentStep.value > 1) {
        currentStep.value--;
    }
}

function setName(name) {
    library.value.name = name;
    nextStep();
}

function setLocations(locations) {
    library.value.locations = locations;
    nextStep();
}

function setCategories(categories) {
    library.value.categories = categories;
    saveLibrary();
}

function saveLibrary() {
    create(library.value)
        .then(response => {
            id.value = response.id;
            successDialog.value = true;
        })
        .catch(err => {
            if (err.message.includes(401)) {
                //? message ?
                router.push('/login');
            } else if (err.message.includes(400)) {
                errorMessage.value = "Hmm... Il semblerait qu'un ou plusieurs paramètres soient invalides, veuillez réessayer...";
                errorDialog.value = true;
            } else if (err.message.includes(500)) {
                errorMessage.value = "Oups! Une erreur s'est produite du côté du serveur...";
                errorDialog.value = true;
            } else {
                errorMessage.value = "Oups! Une erreur inattendue s'est produite...";
                errorDialog.value = true;
            }
        });
}
</script>

<style scoped>
#create-library-carousel {
    max-width: 500px;
}
</style>
  