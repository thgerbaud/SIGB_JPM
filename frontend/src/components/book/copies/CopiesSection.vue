<template>
    <AddCopyModal :library="library" :bookId="book.id" v-model="addCopyModal" @cancel="addCopyModal = false"
        @update="updateBook" />

    <InfoDialog v-model="deletedInfoDialog" @ok="router.push(`/${library.id}/books`)" title="Livre supprimé"
        message="Votre livre a bien été supprimé, vous allez être redirigé vers la page d'accueil de la bibliothèque." />

    <section>
        <h5 class="text-h5 mb-4">Exemplaires ({{ book.copies.length }})</h5>

        <span class="d-flex mt-4">
            <v-table density="compact">
                <thead>
                    <tr>
                        <th class="font-weight-bold">Code</th>
                        <th class="font-weight-bold">Emplacement</th>
                    </tr>
                </thead>
                <tbody>
                    <CopyRaw v-for="(copy, index) in book.copies" :key="copy.id" :copy="copy" :library="library"
                        :book="book" @update="updateBook" />
                </tbody>
            </v-table>
        </span>

        <v-btn variant="text" prepend-icon="mdi-plus" v-if="library.isAdmin" @click="addCopyModal = true">ajouter un
            exemplaire</v-btn>
    </section>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import CopyRaw from '@/components/book/copies/CopyRaw.vue';
import AddCopyModal from '@/components/book/AddCopyModal.vue';
import InfoDialog from '@/components/utils/dialogs/InfoDialog.vue';

defineProps(["book", "library"]);
const emit = defineEmits(["update"]);
const router = useRouter();

const addCopyModal = ref(false);
const deletedInfoDialog = ref(false);

function updateBook(updatedBook) {
    if (updatedBook) {
        addCopyModal.value = false;
        emit('update', updatedBook);
    } else {
        deletedInfoDialog.value = true;
    }
}
</script>