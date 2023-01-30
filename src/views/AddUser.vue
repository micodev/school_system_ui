<template>
  <v-container>
    <v-card class="mt-5" elevation="4" shaped>
      <v-toolbar dark color="secondary">
        <v-toolbar-title align-center>اضافة مستخدم جديد</v-toolbar-title>
      </v-toolbar>
      <v-card-text> <UserForm></UserForm></v-card-text>
    </v-card>
    <v-divider></v-divider>
  </v-container>
</template>

<script>
import UserForm from "../components/forms/AddUserForm.vue";
export default {
  components: {
    UserForm,
  },
};
</script>
