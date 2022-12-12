<template>
  <v-container>
    <v-card>
      <v-toolbar dark color="secondary">
        <v-toolbar-title align-center>اضافة صف جديد</v-toolbar-title>
      </v-toolbar>
      <v-card-text> <StageForm></StageForm></v-card-text>
    </v-card>
    <v-divider></v-divider>
    <v-card class="mt-5"> <StageTable></StageTable> </v-card>
    <v-divider></v-divider>
  </v-container>
</template>
<script>
import StageForm from "../components/forms/StageForm.vue";
import StageTable from "../components/tables/StageTable.vue";
export default {
  components: {
    StageForm,
    StageTable,
  },
};
</script>
