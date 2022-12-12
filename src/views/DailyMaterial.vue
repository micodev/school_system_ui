<template>
  <v-container>
    <v-card class="mb-5">
      <v-toolbar dark color="secondary">
        <v-toolbar-title align-center>أضافة جدول</v-toolbar-title>
      </v-toolbar>
      <v-card-text> <DailyMaterialForm></DailyMaterialForm></v-card-text>
    </v-card>
    <v-divider></v-divider>
    <v-card class="mt-5"> <DailyMaterialTable></DailyMaterialTable> </v-card>
    <v-divider></v-divider>
  </v-container>
</template>
<script>
import DailyMaterialForm from "../components/forms/DailyMaterialForm.vue";
import DailyMaterialTable from "../components/tables/DailyMaterialTable.vue";
export default {
  components: {
    DailyMaterialForm,
    DailyMaterialTable,
  },
};
</script>
