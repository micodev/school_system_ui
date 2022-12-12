<template>
  <v-container>
    <v-card>
      <v-toolbar dark color="secondary">
        <v-toolbar-title align-center>اضافة فصل جديد</v-toolbar-title>
      </v-toolbar>
      <v-card-text> <SemesterForm></SemesterForm></v-card-text>
    </v-card>
    <v-divider></v-divider>
    <v-card class="mt-5"> <SemesterTable></SemesterTable> </v-card>
    <v-divider></v-divider>
  </v-container>
</template>
<script>
import SemesterForm from "../components/forms/SemesterForm.vue";
import SemesterTable from "../components/tables/SemesterTable.vue";
export default {
  components: {
    SemesterForm,
    SemesterTable,
  },
};
</script>
