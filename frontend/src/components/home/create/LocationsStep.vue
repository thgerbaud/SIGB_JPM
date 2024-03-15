<template>
    <div v-if="locations.length > 0" class="py-4">
        <v-chip v-for="(location, index) in locations" :key="location" closable @click:close="removeLocation(index)"
            class="mr-2" color="primary-lighten-1" variant="flat">
            {{ location }}
        </v-chip>
    </div>
    <div v-else class="py-2">
        <p class="empty-section">Aucun emplacement...</p>
    </div>
    <div class="d-flex justify-start">
        <v-text-field v-model="newLocation" variant="outlined" label="Ajouter un emplacement" @keyup.enter="addLocation"
            :rules="[rules.duplicate]" clearable hint="Ex.: ??" persistent-hint></v-text-field>
        <div class="ml-2">
            <v-btn @click="addLocation" icon="mdi-plus"
                :disabled="!newLocation?.trim() || isDuplicate(newLocation)"></v-btn>
        </div>
    </div>
    <div class="d-flex justify-space-between">
        <v-btn-secondary @click="prev" prepend-icon="mdi-chevron-left">Précédent</v-btn-secondary>
        <v-btn-tertiary color="error" @click="emit('cancel')">Annuler</v-btn-tertiary>
        <v-btn @click="setLocations" append-icon="mdi-chevron-right">Suivant</v-btn>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(["prev", "next", "cancel"]);

const locations = ref([]);
const newLocation = ref("");
const rules = {
    duplicate: (value) => (!isDuplicate(value?.trim())) || `Vous avez déjà un emplacement intitulé "${value}".`
};

function addLocation() {
    const location = newLocation.value?.trim();
    if (location && !isDuplicate(location)) {
        locations.value.push(newLocation.value?.trim());
        newLocation.value = "";
    }
}

function removeLocation(index) {
    locations.value.splice(index, 1);
}

function isDuplicate(value) {
    return locations.value.map(location => location.toLowerCase()).includes(value?.toLowerCase());
}

function setLocations() {
    emit('next', locations.value ?? []);
}

function prev() {
    emit('prev');
}
</script>