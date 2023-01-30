<template>
  <v-container fluid class="mt5">
    <v-card-title> </v-card-title>
    <v-card-text><UserTable></UserTable></v-card-text>
  </v-container>
</template>

<script>
import UserTable from "../components/tables/UserTable.vue";
export default {
  components: {
    UserTable,
  },
};
</script>
