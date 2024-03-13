<template>
    <NameSection :library="library"/>

    <LocationsSection :library="library"/>

    <CategoriesSection :library="library"/>

    <v-divider></v-divider>
    <DeleteSection :library="library"/>
    
</template>

<script>
import NameSection from '@/components/settings/library/NameSection.vue';
import LocationsSection from '@/components/settings/library/locations/LocationsSection.vue';
import CategoriesSection from '@/components/settings/library/categories/CategoriesSection.vue';
import DeleteSection from '@/components/settings/library/delete/DeleteSection.vue';
export default {
    props: ["library"],
    components: {
        NameSection,
        LocationsSection,
        CategoriesSection,
        DeleteSection,
    },
}
</script>