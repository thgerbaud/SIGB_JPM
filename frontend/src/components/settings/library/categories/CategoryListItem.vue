<template>
    <ConfirmDeletionDialog v-model="confirmDialog" v-bind="dialogOptions" @cancel="confirmDialog = false" @ok="confirmDeletion" />

    <EditCategoryModal v-model="editCategoryModal" :library="library" :category="category" @cancel="closeEditModal"
        @update="(library) => { closeEditModal(); emit('update', library) }" />

    <SettingsListItem :title="category.name" :loading="loading" @edit="editCategoryModal = true"
        @delete="confirmDialog = true" />
</template>

<script setup>
import { ref, inject, computed } from 'vue';
import ConfirmDeletionDialog from '@/components/utils/dialogs/ConfirmDeletionDialog.vue';
import EditCategoryModal from '@/components/settings/library/categories/EditCategoryModal.vue';
import SettingsListItem from '@/components/settings/SettingsListItem.vue';
import { deleteCategory } from '@/services/LibraryDataService';

const props = defineProps(["library", "category"]);
const emit = defineEmits(["update"]);
const globalEmitter = inject('globalEmitter');

const confirmDialog = ref(false);
const editCategoryModal = ref(false);
const loading = ref(false);

const dialogOptions = computed(() => {
    return {
        title: `Supprimer la catégorie «${props.category.name}» ?`,
        icon: "mdi-tag-remove",
        text: "Si des sous-catégories sont associées à cette catégorie, elles seront également supprimées.",
        cancelText: "Annuler",
        okText: "Supprimer",
    }
});

function closeEditModal() {
    editCategoryModal.value = false;
}

function confirmDeletion() {
    confirmDialog.value = false;
    loading.value = true;
    deleteCategory(props.library.id, props.category.id)
        .then(library => {
            emit('update', library);
            loading.value = false;
        })
        .catch(err => {
            loading.value = false;
            if (err.message.includes('[401]')) {
                globalEmitter.emit('401');
            } else if (err.message.includes('[403]')) {
                globalEmitter.emit('403');
            } else if (err.message.includes('[404]')) {
                globalEmitter.emit('404');
            } else if (err.message.includes('[400]')) {
                globalEmitter.emit('error', { message: "Hmm... Il semblerait qu'un ou plusieurs paramètres soient invalides, veuillez réessayer..." });
            } else if (err.message.includes('[500]')) {
                globalEmitter.emit('error', { message: "Oups! Une erreur s'est produite du côté du serveur..." });
            } else {
                globalEmitter.emit('error', { message: "Oups! Une erreur inattendue s'est produite..." });
            }
        });
}
</script>