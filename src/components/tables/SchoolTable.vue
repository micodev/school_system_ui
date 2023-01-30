<template>
  <v-card class="elevation-1">
    <v-data-table
      :headers="headers"
      :items="schools"
      :search="search"
      loading-text="جاري التحميل يرجى الأنتظار"
    >
      <template v-slot:item="{ item }">
        <tr>
          <td class="text-start">{{ item.name }}</td>
          <td class="text-start">{{ item.address }}</td>
          <td class="text-start">{{ item.CountUser }}</td>
        </tr>
      </template>
      <template v-slot:top>
        <v-toolbar>
          <v-toolbar-title class="white--darkgrey"
            >جدول المدارس</v-toolbar-title
          >
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="بحث"
            single-line
            hide-details
          ></v-text-field>
        </v-toolbar>
      </template>
    </v-data-table>
  </v-card>
</template>
<script>
export default {
  data() {
    return {
      search: "",
      headers: [
        {
          text: "اسم الكلية",
          value: "name",
          class: "secondary white--text title",
        },
        {
          text: "عنوان الكلية",
          value: "address",
          class: "secondary white--text title",
        },
        {
          text: "عدد الطلاب",
          value: "user_count",
          class: "secondary white--text title",
        },
      ],
    };
  },
  computed: {
    schools() {
      return this.$store.state.SchoolModule.schools;
    },
    table_loading() {
      return this.$store.state.SchoolModule.table_loading;
    },
  },
  methods: {
    getSchools() {
      this.$store.dispatch("SchoolModule/getSchools");
    },
  },
  created() {
    this.getSchools();
  },
};
</script>
<style></style>
