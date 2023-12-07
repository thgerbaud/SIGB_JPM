<template>
    <StepTemplate :stepIndex="step" :stepName="'Catégories'" isLastStep @next="setCategories">
        <template v-slot:input-section>
            <div id="categories-input">
                <div class="form-group">
                    <label for="categorie1">Catégorie 1 : <span>(optionnel)</span></label>
                    <input type="text" id="categorie1" v-model="categories[0]" name="categorie1" placeholder="Ex. : ???" />
                </div>
                <div class="form-group">
                    <label for="categorie2">Catégorie 2 : <span>(optionnel)</span></label>
                    <input type="text" id="categorie2" v-model="categories[1]" name="categorie2" placeholder="Ex. : ???" />
                </div>
                <div class="form-group">
                    <label for="categorie3">Catégorie 3 : <span>(optionnel)</span></label>
                    <input type="text" id="categorie3" v-model="categories[2]" name="categorie3" placeholder="Ex. : ???" />
                </div>
            </div>
        </template>
    </StepTemplate>
</template>

<script>
import StepTemplate from '@/components/library/StepTemplate.vue';
export default {
    props: ["step", "currentCategories"],
    data() {
        return {
            categories: this.currentCategories 
        }
    },
    components: {
        StepTemplate
    },
    methods: {
        setCategories() {
            //TODO vérifier si mêmes noms
            this.categories = this.categories.filter((categorie) => categorie != '');
            this.$emit('setCategories', this.categories);
        }
    }
}
</script>

<style scoped>
#categories-input {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
</style>