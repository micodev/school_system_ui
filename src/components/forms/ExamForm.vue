<template>
  <v-container>
    <v-form ref="form" class="mr-10">
      <v-col cols="12" md="12" lg="12">
        <v-row>
          <v-col class="d-flex" cols="12" sm="5">
            <v-autocomplete
              clearable
              :items="stages"
              v-model="selected_object.class_id"
              item-text="name"
              item-value="id"
              label="الصف"
              @change="onChange"
            ></v-autocomplete>
          </v-col>
          <v-col class="d-flex" cols="12" sm="5">
            <v-autocomplete
              clearable
              :items="materials"
              v-model="selected_object.material_id"
              item-text="name"
              item-value="id"
              label="المادة"
              @change="onChange"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" sm="2">
            <v-text-field
              v-model="selected_object.lesson_number"
              placeholder="عدد الدروس"
              label="عدد الدروس"
              hide-details="auto"
              :rules="rules"
              clearable
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="d-flex" cols="12" sm="6">
            <v-autocomplete
              clearable
              :items="days"
              v-model="selected_object.day"
              item-text="day"
              item-value="day"
              label="اليوم"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" sm="6">
            <v-menu
              v-model="menu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  clearable
                  v-model="selected_object.date"
                  label="تأريخ الامتحان "
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  hint="يجب ادخال تأريخ الامتحان بعد تأريخ اليوم"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="selected_object.date"
                @input="menu = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" align-self="center" class="text-center">
            <v-row justify="center">
              <v-col cols="auto">
                <v-btn secondary color="secondary" @click="validateField">
                  {{ isEdit ? "تعديل القيد" : "أضافة قيد" }}
                </v-btn>
              </v-col>
              <v-col cols="auto">
                <v-btn secondary color="secondary" @click="reset">
                  تصفير الحقول
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-form>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      rules: [(value) => !!value || "هذا الحقل مطلوب."],

      menu: null,
      days: [
        { day: "السبت" },
        { day: "الاحد" },
        { day: "الاثنين" },
        { day: "الثلاثاء" },
        { day: "الاربعاء" },
        { day: "الخميس" },
      ],
    };
  },
  computed: {
    stages() {
      return this.$store.state.StageModule.stages;
    },
    materials() {
      return this.$store.state.MaterialModule.materials;
    },
    selected_object() {
      return this.$store.state.ExamModule.selected_object;
    },
    isEdit() {
      return this.$store.state.ExamModule.isEdit;
    },
  },

  methods: {
    onChange() {
      this.$store.state.ExamModule.class_name = null;
      this.$store.state.ExamModule.class_id = this.selected_object.class_id;
      let class_name = this.stages.filter(
        (stage) => stage.id === this.selected_object.class_id
      )[0].name;
      this.$store.state.ExamModule.class_name = class_name;
      this.$store.dispatch("ExamModule/getExams");
    },
    getStages() {
      this.$store.dispatch("StageModule/getStages");
    },
    getMaterials() {
      this.$store.dispatch("MaterialModule/getMaterials");
    },
    reset() {
      this.$store.state.ExamModule.isEdit = false;
      this.$refs.form.reset();
    },
    addExam(data) {
      this.$store.dispatch("ExamModule/addExam", data);
    },
    editExam(data) {
      this.$store.dispatch("ExamModule/editExam", data);
      // // console.log(data);
    },
    validateField() {
      if (this.$refs.form.validate()) {
        let data = {};
        data["class_id"] = this.selected_object.class_id;
        data["day"] = this.selected_object.day;
        data["material_id"] = this.selected_object.material_id;
        data["lesson_number"] = this.selected_object.lesson_number;
        data["date"] = this.selected_object.date;
        if (this.isEdit) {
          data["exam_id"] = this.selected_object.id;
          this.editExam(data);
          this.reset();
        } else {
          this.addExam(data);
        }
      }
    },
  },
  created() {
    this.getStages();
    this.getMaterials();
  },

  watch: {
    stages(value) {
      // console.log(value);
      this.$store.state.ExamModule.defaultClass_id = this.stages[0].id;
      this.selected_object.class_id = this.stages[0].id;
      this.$store.state.ExamModule.class_name = this.stages[0].name;
      this.$store.dispatch("ExamModule/getExams");
    },
  },
};
</script>
<style></style>
