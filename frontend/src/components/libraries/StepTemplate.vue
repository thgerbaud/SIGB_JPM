<template>
    <div class="step-template">
        <div class="step-index-container">
            <div class="step-index center-content">
                <span>{{ stepIndex }}</span>
            </div>
            <h2>{{ stepName }}</h2>
            <legend v-for="(legend,index) in legends" :key="index">{{ legend}}</legend>
        </div>
        <div>
            <slot name="input-section"></slot>
        </div>
        <menu :class="{'first-step':isFirstStep}">
            <button v-if="!isFirstStep" class="secondary" @click="this.$emit('previous',stepIndex)">Précédent</button>
            <button v-if="isLastStep" @click="this.$emit('next')">Terminer</button>
            <button v-else @click="this.$emit('next')">Suivant</button>
        </menu>
    </div>
</template>

<script>
export default {
    props: {
        stepIndex: {
            type: Number,
            required: true
        },
        stepName: {
            type: String,
            required: true
        },
        legends: {
            type: Array,
        },
        isFirstStep: {
            type: Boolean,
            default: false
        },
        isLastStep: {
            type: Boolean,
            default: false
        },
        onclick: {
            type: Function
        }
    }
}
</script>

<style scoped>
menu {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
}
menu.first-step {
    grid-template-columns: 1fr;
}
.step-index-container {
    margin-bottom: 3rem;
}
.step-template {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
.step-index {
    margin: auto;
    font-size: 3rem;
    height: 5rem;
    display: flex;
    aspect-ratio: 1;
    background-color: var(--secondary);
    border-radius: 2.5rem;
}

h2 {
    text-align: center;
}
</style>