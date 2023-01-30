<template>
  <v-container>
    <v-card class="mb-5">
      <v-toolbar dark color="secondary">
        <v-toolbar-title align-center>اضافة مدرسة </v-toolbar-title>
      </v-toolbar>
      <v-card-text> <SchoolForm></SchoolForm></v-card-text>
    </v-card>
    <v-divider></v-divider>
    <v-card class="mt-5"> <SchoolTable></SchoolTable> </v-card>
    <v-divider></v-divider>
  </v-container>
</template>
<script>
import SchoolForm from "../components/forms/SchoolForm.vue";
import SchoolTable from "../components/tables/SchoolTable.vue";
export default {
  components: {
    SchoolForm,
    SchoolTable,
  },
};
</script>
