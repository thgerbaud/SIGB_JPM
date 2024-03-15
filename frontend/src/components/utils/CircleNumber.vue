<template>
    <v-avatar :size="size" color="secondary">
        <v-row align="center" justify="center" style="height: 100%;">
            <v-col>
                <span class="white--text" :style="{ fontSize: textSize }">{{ number }}</span>
            </v-col>
        </v-row>
    </v-avatar>
</template>
  
<script setup>
import { computed } from 'vue';

const props = defineProps({
    number: Number,
    size: {
        type: Number,
        default: 50
    }
});

const textSize = computed(() => {
    return `${props.size / 2}px`;
});
</script>