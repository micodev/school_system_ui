<template>
  <v-container>
    <v-form ref="form" class="mr-10">
      <v-col cols="12" md="12" lg="12">
        <v-row>
          <v-col class="d-flex" cols="12" sm="4">
            <v-autocomplete
              clearable
              :items="stages"
              v-model="class_id"
              item-text="name"
              item-value="id"
              label="المرحلة"
            ></v-autocomplete>
          </v-col>
          <v-col class="d-flex" cols="12" sm="4">
            <v-autocomplete
              clearable
              :items="materials"
              v-model="material_id"
              item-text="name"
              item-value="id"
              label="المادة"
            ></v-autocomplete>
          </v-col>
          <v-col class="d-flex" cols="12" sm="4">
            <v-autocomplete
              clearable
              :items="teachers"
              v-model="user_id"
              ref="teacherDropdown"
              item-text="full_name"
              item-value="id"
              label="اختر مدرس"
              :loading="loading"
              :menu-props="menu_props"
              :search-input.sync="teacherQuery"
              :value="teacherQuery"
              @change="onChange"
            >
              <template v-slot:append-item>
                <div
                  v-if="!($store.state.UserModule.teacher_state == 'finished')"
                  v-intersect="teacherInteract"
                  class="text-xs-center"
                ></div> </template
            ></v-autocomplete>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" align-self="center" class="text-center">
            <v-row justify="center">
              <v-col cols="auto">
                <v-btn secondary color="secondary" @click="addExam">
                  اضافة قيد
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
      class_id: "",
      material_id: "",
      user_id: "",
      isSelection: false,
      menu_props: {
        closeOnClick: false,
        closeOnContentClick: false,
        disableKeys: true,
        openOnClick: false,
        maxHeight: 150,
        offsetY: true,
        offsetOverflow: true,
        transition: false,
      },
    };
  },
  computed: {
    teacherQuery: {
      get() {
        return this.$store.state.UserModule.teacherQuery;
      },
      set(value) {
        this.$store.state.UserModule.teacherQuery = value;
      },
    },
    loading() {
      return this.$store.state.UserModule.table_loading;
    },
    stages() {
      return this.$store.state.StageModule.stages;
    },
    teachers() {
      return this.$store.state.UserModule.teachers;
    },
    materials() {
      return this.$store.state.MaterialModule.materials;
    },
  },

  methods: {
    onChange() {
      this.isSelection = true;
    },
    updateTeacherSearch(value) {
      clearTimeout(this._timerId);
      // delay new call 1000ms
      this._timerId = setTimeout(() => {
        if (this.teacherQuery == null) {
          return;
        }
        this.$store.dispatch("UserModule/resetFields");
        this.$store.state.UserModule.params.page = 1;

        if (
          this.teacherQuery.length == 0 ||
          (this.teacherQuery.length == 1 && this.teacherQuery == " ")
        )
          this.teacherQuery = value.replace(/\s/g, "");
        // هاي تلغي ال space
        else {
          this.$store.state.UserModule.teacherQuery = value;
        }
        // this.$store.state.UserModule.params.query = this.teacherQuery;
        this.$store.dispatch("UserModule/resetFields");
        this.getTeachers();
      }, 1000);
    },
    getStages() {
      this.$store.dispatch("StageModule/getStages");
    },
    getTeachers() {
      if (this.$store.state.UserModule.teacher_state == "finished") return;

      this.$store.dispatch("UserModule/getTeachers");
    },
    getMaterials() {
      this.$store.dispatch("MaterialModule/getMaterials");
    },
    teacherInteract(entries, observer, isIntersecting) {
      if (isIntersecting) {
        setTimeout(() => {
          this.getTeachers(); // onscroll
          // console.log("on scroll");
          this.$refs.teacherDropdown.onScroll();
        }, 500);
      }
    },
    reset() {
      this.$refs.form.reset();
    },
    addExam() {
      let data = {};
      data["class_id"] = this.class_id;
      data["material_id"] = this.material_id;
      data["teacher_id"] = this.user_id;
      this.$store.dispatch("StageMaterialTeacherModule/addSMT", data);
    },
  },
  created() {
    this.getStages();
    this.getMaterials();
    // this.getTeachers();
  },
  watch: {
    teacherQuery: function () {
      if (this.isSelection) {
        this.isSelection = false;
        return;
      }
      this.updateTeacherSearch(this.teacherQuery);
    },
  },
};
</script>
