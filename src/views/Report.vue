<template>
  <v-container>
    <v-card class="mb-5">
      <v-toolbar dark color="secondary">
        <v-toolbar-title align-center>اضافة تبليغ </v-toolbar-title>
      </v-toolbar>
      <v-card-text> <ReportForm></ReportForm></v-card-text>
    </v-card>
    <v-divider></v-divider>
    <v-card class="mt-5"> <ReportTable></ReportTable> </v-card>
    <v-divider></v-divider>
  </v-container>
</template>
<script>
import ReportForm from "../components/forms/ReportForm.vue";
import ReportTable from "../components/tables/ReportTable.vue";
export default {
  components: {
    ReportForm,
    ReportTable,
  },
};
</script>
