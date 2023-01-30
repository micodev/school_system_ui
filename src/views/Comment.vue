<template>
  <v-container class="mt-10">
    <CommentTable></CommentTable>
  </v-container>
</template>

<script>
import CommentTable from "../components/tables/CommentTable.vue";
export default {
  components: {
    CommentTable,
  },
};
</script>
