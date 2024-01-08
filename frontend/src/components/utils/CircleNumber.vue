<template>
    <v-avatar :size="size" color="secondary">
        <v-row align="center" justify="center" style="height: 100%;">
            <v-col>
                <span class="white--text" :style="{ fontSize: textSize }">{{ number }}</span>
            </v-col>
        </v-row>
    </v-avatar>
</template>
  
<script>
export default {
    props: {
        number: Number,
        size: {
            type: Number,
            default: 50
        }
    },
    computed: {
        textSize() {
            return `${this.size / 2}px`;
        }
    }
};
</script>