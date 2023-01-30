<template>
  <v-card class="elevation-1">
    <v-data-table
      :headers="headers"
      :items="stages"
      :search="search"
      loading-text="جاري التحميل يرجى الأنتظار"
    >
      <template v-slot:item="{ item }">
        <tr>
          <td class="text-start">{{ item.name }}</td>
          <td class="text-start">{{ item.fee }}</td>
          <td class="text-start" v-if="!item.users_count">0</td>
          <td class="text-start" v-else>{{ item.users_count }}</td>
          <td class="text-start">
            <v-btn dark color="secondary" @click="showStudent(item.id)">
              عرض الطلاب
            </v-btn>
          </td>
        </tr>
      </template>
      <template v-slot:top>
        <v-toolbar>
          <v-toolbar-title class="white--darkgrey"
            >جدول المراحل</v-toolbar-title
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
          text: "المرحلة",
          value: "name",
          class: "secondary white--text title",
        },
        {
          text: "القسط",
          value: "fee",
          class: "secondary white--text title",
        },
        {
          text: "عدد الطلاب",
          value: "users_count",
          class: "secondary white--text title",
        },
        {
          text: "عرض الطلاب",
          class: "secondary white--text title",
        },
      ],
      dialog: false,
    };
  },
  computed: {
    stages() {
      return this.$store.state.StageModule.stages;
    },
    table_loading() {
      return this.$store.state.StageModule.table_loading;
    },
  },
  methods: {
    showStudent(item) {
      var filter = { name: "class_id", value: [item] };
      Object.assign(this.$store.state.UserModule.filter, filter);
      this.$store.state.UserModule.active_side_bar = false;
      this.$store.dispatch("UserModule/getUsers");
      this.$router.push("Student");
    },
    getStages() {
      this.$store.dispatch("StageModule/getStages");
    },
  },
  created() {
    this.getStages();
  },
};
</script>
<style></style>
