<template>
  <v-container>
    <v-card class="mb-5">
      <v-toolbar dark color="secondary">
        <v-toolbar-title align-center>اضافة شهادة </v-toolbar-title>
      </v-toolbar>
      <v-card-text> <CertificateForm></CertificateForm></v-card-text>
    </v-card>
    <v-divider></v-divider>
    <CertificateTable></CertificateTable>
    <v-divider></v-divider>
  </v-container>
</template>
<script>
import CertificateForm from "../components/forms/CertificateForm.vue";
import CertificateTable from "../components/tables/CertificateTable.vue";
export default {
  components: {
    CertificateForm,
    CertificateTable,
  },
};
</script>
