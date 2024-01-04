<template>
    <StepTemplate :stepIndex="step" :stepName="'Nom'" isFirstStep @next="setName">
        <template v-slot:input-section>
            <div class="form-group">
                <label for="name">Choisissez un nom pour votre bibliothèque :</label>
                <input type="text" id="name" required v-model="name"
                    placeholder="Nom de la bibliothèque" />
            </div>
        </template>
    </StepTemplate>
</template>

<script>
import StepTemplate from '@/components/libraries/StepTemplate.vue';
export default {
    props: ["step", "currentName"],
    data() {
        return {
            name: this.currentName,
        }
    },
    components: {
        StepTemplate
    },
    methods: {
        isNameEmpty() {
            return this.name.trim() === ""
        },
        setName() {
            if(this.isNameEmpty()) {
                alert("Le nom ne doit pas être vide");
            } else {
                //TODO vérification n'existe pas déjà
                this.$emit('setName', this.name.trim());
            }
        }
    }
}
</script>