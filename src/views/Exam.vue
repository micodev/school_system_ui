<template>
  <v-container>
    <v-card class="mb-5">
      <v-toolbar dark color="secondary">
        <v-toolbar-title align-center>اضافة جدول امتحان </v-toolbar-title>
      </v-toolbar>
      <v-card-text> <ExamForm></ExamForm></v-card-text>
    </v-card>
    <v-divider></v-divider>
    <v-card class="mt-5"> <ExamTable></ExamTable> </v-card>
    <v-divider></v-divider>
  </v-container>
</template>
<script>
import ExamForm from "../components/forms/ExamForm.vue";
import ExamTable from "../components/tables/ExamTable.vue";
export default {
  components: {
    ExamForm,
    ExamTable,
  },
};
</script>
