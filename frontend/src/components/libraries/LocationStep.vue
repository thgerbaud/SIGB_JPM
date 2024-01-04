<template>
    <StepTemplate :stepIndex="step" :stepName="'Emplacements'" :legends="legends" @next="setLocations">
        <template v-slot:input-section>
            <div id="locations-list" v-if="locations.length > 0">
                <LocationItem v-for="(location, index) in locations" :key="index" :location="location"
                    @remove="removeLocation(index)" />
            </div>
            <div v-else>
                <p class="empty-section">Aucun emplacement...</p>
            </div>
            <div class="form-group">
                <label for="new-location">Ajouter un emplacement : <span>(optionnel)</span></label>
                <span id="location-input">
                    <input type="text" id="new-location" v-model="newLocation" @keyup.enter="addLocation" placeholder="Ex. : Bibliothèque 1" />
                    <button id="add-btn" @click="addLocation" :disabled="newLocation.trim() === ''">+</button>
                </span>
            </div>
        </template>
    </StepTemplate>
</template>

<script>
import StepTemplate from '@/components/libraries/StepTemplate.vue';
import LocationItem from '@/components/libraries/LocationItem.vue';
export default {
    props: ["step", "currentLocations"],
    data() {
        return {
            locations: this.currentLocations,
            newLocation: "",
            legends: [
                "Indiquez les différente emplacements (salles, meubles, bâtiments...) dans lesquels se trouvent vos livres afin d'indiquer à vos utilisateurs où les trouver.",
                "Si tous vos livres sont situés au même endroit vous pouvez passer directement à l'étape suivante.",
                "(Vous pourrez modifier les emplacements plus tard dans les paramètres de la bibliothèque.)"
            ]
        }
    },
    components: {
        StepTemplate,
        LocationItem
    },
    methods: {
        addLocation() {
            if (this.locations.includes(this.newLocation.trim())) {
                alert("Vous avez déjà un lieu avec le même nom !");
            } else {
                this.locations.push(this.newLocation.trim());
                this.newLocation = "";
            }
        },
        removeLocation(index) {
            this.locations.splice(index, 1);
        },
        setLocations() {
            this.$emit('setLocations', this.locations);
        }
    }
}
</script>

<style scoped>
#locations-list {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    margin-bottom: 1rem;
}
#location-input {
    display: flex;
    gap: 0.25rem;
}
#new-location {
    flex-grow: 1;
}
#add-btn {
    font-size: 1.25rem;
    padding: 0 0.75rem;
    text-align: center;
    border-radius: 0;
}
</style>