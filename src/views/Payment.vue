<template>
  <v-container>
    <v-card class="mb-5">
      <v-toolbar dark color="secondary">
        <v-toolbar-title align-center>اضافة دفعة جديدة </v-toolbar-title>
      </v-toolbar>
      <v-card-text> <PaymentForm></PaymentForm></v-card-text>
    </v-card>
    <v-divider></v-divider>
    <v-card class="mt-5"> <PaymentTable></PaymentTable> </v-card>
    <v-divider></v-divider>
  </v-container>
</template>
<script>
import PaymentForm from "../components/forms/PaymentForm.vue";
import PaymentTable from "../components/tables/PaymentTable.vue";
export default {
  components: {
    PaymentForm,
    PaymentTable,
  },
};
</script>
