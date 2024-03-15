<template>
    <SettingsSectionTemplate title="Nom">
        <template #content>
            <p>{{ library.name }}</p>
        </template>
    </SettingsSectionTemplate>
</template>

<script setup>
import SettingsSectionTemplate from '@/components/settings/SettingsSectionTemplate.vue';

defineProps(["library"]);
</script>