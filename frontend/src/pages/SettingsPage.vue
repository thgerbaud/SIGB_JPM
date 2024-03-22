<template>
    <SectionTemplate title="Paramètres">
        <v-tabs v-model="tab" fixed-tabs>
            <v-tab :value="0" class="text-md-h6">Bibliothèque</v-tab>
            <v-tab :value="1" class="text-md-h6">Utilisateurs</v-tab>
        </v-tabs>

        <v-window v-model="tab" class="mt-4">
            <v-window-item :value="0">
                <LibraryTab :library="library" />
            </v-window-item>

            <v-window-item :value="1">
                <UsersTab :library="library" />
            </v-window-item>
        </v-window>
    </SectionTemplate>
</template>

<script setup>
import { ref } from 'vue';
import LibraryTab from '@/components/settings/LibraryTab.vue';
import UsersTab from '@/components/settings/UsersTab.vue';
import SectionTemplate from '@/components/utils/SectionTemplate.vue';

defineProps(["library"]);

const tab = ref(0);
</script>