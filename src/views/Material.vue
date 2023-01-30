<template>
  <v-container>
    <v-card class="mb-5">
      <v-toolbar dark color="secondary">
        <v-toolbar-title align-center>اضافة مادة جديد</v-toolbar-title>
      </v-toolbar>
      <v-card-text> <MaterialForm></MaterialForm></v-card-text>
    </v-card>
    <v-divider></v-divider>
    <v-card class="mt-5"> <MaterialTable></MaterialTable> </v-card>
    <v-divider></v-divider>
  </v-container>
</template>
<script>
import MaterialForm from "../components/forms/MaterialForm.vue";
import MaterialTable from "../components/tables/MaterialTable.vue";
export default {
  components: {
    MaterialForm,
    MaterialTable,
  },
};
</script>
