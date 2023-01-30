<template>
  <v-container fluid class="mt5">
    <v-card-title> </v-card-title>
    <v-card-text><TeacherTable></TeacherTable></v-card-text>
  </v-container>
</template>

<script>
import TeacherTable from "../components/tables/TeacherTable.vue";
export default {
  components: {
    TeacherTable,
  },
};
</script>
