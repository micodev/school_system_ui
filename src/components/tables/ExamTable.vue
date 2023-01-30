<template>
  <v-card class="elevation-1">
    <template>
      <v-row justify="center">
        <v-dialog v-model="dialog" persistent max-width="390">
          <v-card>
            <v-card-title class="text-h5 dark white--text">
              هل أنت متأكد من عملية الحذف
            </v-card-title>
            <v-card-text class="mt-5 text-h5 dark--text"
              ><b>تأكيد عملية الحذف</b></v-card-text
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                class="dark"
                color="white darken-1"
                text
                @click="dialog = false"
              >
                غلق
              </v-btn>
              <v-btn
                class="dark"
                color="white darken-1"
                text
                @click="deleteExam()"
              >
                تأكيد الحذف
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template>
    <v-data-table
      :headers="headers"
      :items="exams"
      :search="search"
      loading-text="جاري التحميل يرجى الأنتظار"
    >
      <template v-slot:item="{ item }">
        <tr @dblclick="rowClicked(item)">
          <td class="text-start">{{ item.day }}</td>
          <td class="text-start">{{ item.date }}</td>
          <td class="text-start">{{ item.material.name }}</td>
          <td class="text-start">{{ item.lesson_number }}</td>
          <td class="text-start">
            <v-btn dark color="red" @click="getItem(item)">حذف </v-btn>
          </td>
        </tr>
      </template>
      <template v-slot:top>
        <v-toolbar>
          <v-toolbar-title class="white--darkgrey"
            >جدول المواد الامتحانية <b>{{ class_name }}</b>
          </v-toolbar-title>
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
      dialog: false,
      item: {},

      headers: [
        {
          text: "اليوم ",
          value: "day",
          class: "secondary white--text title",
        },
        {
          text: "التأريخ",
          value: "date",
          class: "secondary white--text title",
        },
        {
          text: "المادة",
          value: "materials",
          class: "secondary white--text title",
        },
        {
          text: "عدد المحاضرات",
          value: "lesson_number",
          class: "secondary white--text title",
        },
        {
          text: "الحذف",
          class: "secondary white--text title",
        },
      ],
    };
  },
  computed: {
    exams() {
      return this.$store.state.ExamModule.exams;
    },
    class_name() {
      return this.$store.state.ExamModule.class_name;
    },

    materials() {
      return this.$store.state.MaterialModule.materials;
    },
    table_loading() {
      return this.$store.state.DailyMaterialModule.table_loading;
    },
  },
  methods: {
    getItem(item) {
      this.dialog = true;
      this.item = item;
    },
    deleteExam() {
      this.$store.dispatch("ExamModule/deleteExam", this.item);
      this.dialog = false;
      this.item = {};
    },
    getExams() {
      this.$store.dispatch("ExamModule/getExams");
    },
    rowClicked(item) {
      this.$store.state.ExamModule.selected_object = {};
      Object.assign(this.$store.state.ExamModule.selected_object, item);
      this.$store.state.ExamModule.isEdit = true;
    },
  },
  created() {
    this.getExams();
  },
};
</script>
<style></style>
