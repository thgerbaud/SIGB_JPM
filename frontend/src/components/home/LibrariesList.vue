<template>
    <div id="libraries-list">
        <h1>Mes bibliothèques :</h1>
        <div v-if="libraries.length == 0"><i>Aucune bibliothèque pour le moment</i></div>
        <LibraryItem v-else v-for="(library, index) in libraries" :key="index" :library="library" />
        <button id="create-library-btn" class="secondary" @click="this.$router.push('/home/create')">+ créer une bibliothèque</button>
    </div>
</template>

<script>
import LibraryDataService from "@/services/LibraryDataService";
import LibraryItem from "@/components/home/LibraryItem.vue";
export default {
    props: ["user"],
    data() {
        return {
            libraries: [],
        };
    },
    components: {
        LibraryItem
    },
    methods: {
        retrieveLibraries() {
            LibraryDataService.getAll(this.user?.email)
                .then(response => {
                    this.libraries = response.data;
                })
                .catch(e => {
                    console.log(e);
                });
        }
    },
    created() {
        this.retrieveLibraries();
    }
};
</script>

<style scoped>
#libraries-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: 0 5rem;
}

#create-library-btn {
    color: var(--white);
    padding: 1rem 1.5rem;
}
</style>