<template>
  <v-container>
    <v-card class="mb-5">
      <v-toolbar dark color="secondary">
        <v-toolbar-title align-center>توزيع المحاضرات</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <StageMaterialTeacherForm></StageMaterialTeacherForm
      ></v-card-text>
    </v-card>
    <v-divider></v-divider>
    <v-card class="mt-5">
      <StageMaterialTeacherTable></StageMaterialTeacherTable>
    </v-card>
    <v-divider></v-divider>
  </v-container>
</template>
<script>
import StageMaterialTeacherForm from "../components/forms/StageMaterialTeacherForm.vue";
import StageMaterialTeacherTable from "../components/tables/StageMaterialTeacherTable.vue";
export default {
  components: {
    StageMaterialTeacherForm,
    StageMaterialTeacherTable,
  },
};
</script>
