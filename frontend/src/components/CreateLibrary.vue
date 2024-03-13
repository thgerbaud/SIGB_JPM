<template>
    <ConfirmDialog v-model="cancelDialog" title="Annuler la création"
        text="Annuler la création et quitter la page ? Les données entrées seront perdues." 
        okText="Continuer la création" @ok="cancelDialog = false"
        cancelText="Quitter" @cancel="$router.push('/home/libraries/')"
        />

    <CreateSuccessDialog v-model="successDialog" :id="id" :name="library.name"/>

    <ErrorDialog v-model="errorDialog" @close="errorDialog = false" :message="errorMessage" />

    <v-container>
        <span class="text-center">
            <h2 class="text-h2">Créer une nouvelle bibliothèque</h2>
        </span>
        <v-carousel :show-arrows="false" progress="primary-lighten-1" id="create-library-carousel" class="mx-auto my-8"
            height="auto" v-model="currentStep" hide-delimiters>
            <v-carousel-item v-for="(step, index) in steps" :key="index">
                <v-card class="pa-4 ma-auto">
                    <div class="ma-4 text-center">
                        <CircleNumber :number="index + 1" :size="70" />
                        <h2>{{ step.name }}</h2>
                    </div>
                    <div v-for="(legend, index) in step.legends" :key="index" class="text-justify mb-4">{{ legend }}</div>
                    <component :is="step.component" @prev="step.prev" @next="step.next" @cancel="cancelDialog = true" />
                </v-card>
            </v-carousel-item>
        </v-carousel>
    </v-container>
</template>
  
<script>
import { shallowRef } from 'vue';
import { create } from '@/services/LibraryDataService';
import NameStep from '@/components/home/create/NameStep.vue';
import LocationsStep from '@/components/home/create/LocationsStep.vue';
import CategoriesStep from '@/components/home/create/CategoriesStep.vue';
import CircleNumber from '@/components/utils/CircleNumber.vue';
import ConfirmDialog from '@/components/utils/dialogs/ConfirmDialog.vue';
import CreateSuccessDialog from '@/components/home/create/CreateSuccessDialog.vue';
import ErrorDialog from '@/components/utils/dialogs/ErrorDialog';
export default {
    data() {
        return {
            steps: [
                {
                    name: "Nom",
                    component: shallowRef(NameStep),
                    legends: ["Choisissez un nom pour votre bibliothèque :"],
                    prev: () => { },
                    next: this.setName
                },
                {
                    name: "Emplacements",
                    component: shallowRef(LocationsStep),
                    legends: [
                        "Indiquez les différente emplacements (salles, meubles, bâtiments...) dans lesquels se trouvent vos livres afin d'indiquer à vos utilisateurs où les trouver.",
                        "Si tous vos livres sont situés au même endroit vous pouvez passer directement à l'étape suivante.",
                        "(Vous pourrez modifier les emplacements plus tard dans les paramètres de la bibliothèque.)"
                    ],
                    prev: this.prevStep,
                    next: this.setLocations
                },
                {
                    name: "Catégories",
                    component: shallowRef(CategoriesStep),
                    legends: [
                        "Vous pouvez indiquer des catégories et sous-catégories (jusqu'à 3 niveaux) pour classer vos livres.",
                        "(Vous pourrez modifier les catégories plus tard dans les paramètres de la bibliothèque.)"
                    ],
                    prev: this.prevStep,
                    next: this.setCategories
                }
            ],
            currentStep: 0,
            successDialog: false,
            cancelDialog: false,
            errorDialog: false,
            errorMessage: "Oups! une erreur s'est produite...",
            library: {
                name: "",
                locations: [],
                categories: []
            },
            id: null
        };
    },
    components: {
        CircleNumber,
        ConfirmDialog,
        CreateSuccessDialog,
        ErrorDialog
    },
    methods: {
        nextStep() {
            if (this.currentStep < this.steps.length) {
                this.currentStep++;
            }
        },
        prevStep() {
            if (this.currentStep > 0) {
                this.currentStep--;
            }
        },
        setName(name) {
            this.library.name = name;
            this.nextStep();
        },
        setLocations(locations) {
            this.library.locations = locations;
            this.nextStep();
        },
        setCategories(categories) {
            this.library.categories = categories;
            this.saveLibrary();
        },
        saveLibrary() {
            create(this.library)
                .then(response => {
                    this.id = response.id;
                    console.log(response);
                    this.successDialog = true;
                })
                .catch(err => {
                    if (err.message.includes(401)) {
                        //? message ?
						this.$router.push('/login');
					} else if (err.message.includes(400)) {
						this.errorMessage = "Hmm... Il semblerait qu'un ou plusieurs paramètres soient invalides, veuillez réessayer...";
						this.errorDialog = true;
					} else if (err.message.includes(500)) {
						this.errorMessage = "Oups! Une erreur s'est produite du côté du serveur...";
						this.errorDialog = true;
					} else {
						this.errorMessage = "Oups! Une erreur inattendue s'est produite...";
						this.errorDialog = true;
					}
                });
        }
    },
};
</script>

<style scoped>
#create-library-carousel {
    max-width: 500px;
}
</style>
  