<template>
    <SectionTemplate :subtitle="`Commentaires (${ book.comments.length })`">
        <AddCommentForm v-if="!hasPosted" :bookId="book.id" @update="update" />
        <CommentItem v-for="comment in book.comments" :bookId="book.id" :comment="comment" :key="comment.id"
            @update="update" />
    </SectionTemplate>
</template>

<script setup>
import { computed } from 'vue';
import { useUserStore } from '@/store/user';
import SectionTemplate from '@/components/utils/SectionTemplate.vue';
import CommentItem from '@/components/book/comments/CommentItem.vue';
import AddCommentForm from '@/components/book/comments/AddCommentForm.vue';

const props = defineProps(["book"]);
const emit = defineEmits(["update"]);
const userStore = useUserStore();

const hasPosted = computed(() => {
    return props.book.comments.some(comment => comment.author === userStore.user.email);
});

function update(updatedBook, message) {
    emit('update', updatedBook, message);
}
</script>