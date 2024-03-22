<template>
    <v-stepper-item :title="title" :value="value" :complete="isComplete" :color="color"></v-stepper-item>

    <v-divider v-if="!isLast"></v-divider>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps(["title", "value", "currentStep", "isLast"]);

const isComplete = computed(() => {
    return props.currentStep > props.value;
});

const color = computed(() => {
    if (props.currentStep === props.value) {
        return "secondary";
    } else if (isComplete.value) {
        return "primary";
    } else {
        return "";
    }
});
</script>