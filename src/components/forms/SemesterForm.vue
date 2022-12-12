<template>
  <v-container>
    <v-form ref="form" class="mr-10">
      <v-col cols="12" md="12" lg="12">
        <v-row>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="name"
              placeholder="اسم الفصل "
              label="اسم الفصل "
              hide-details="auto"
              :rules="rules"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="max_degree"
              placeholder="الدرجة"
              label="الدرجة"
              hide-details="auto"
              :rules="rules"
              clearable
            ></v-text-field>
          </v-col>
          <v-col class="d-flex" cols="12" sm="4">
            <v-autocomplete
              clearable
              :items="stages"
              v-model="class_id"
              item-text="name"
              item-value="id"
              label="الصف"
            ></v-autocomplete>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" align-self="center" class="text-center">
            <v-row justify="center">
              <v-col cols="auto">
                <v-btn secondary color="secondary" @click="addSemester">
                  اضافة
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
      name: "",
      max_degree: "",
      class_id: "",
    };
  },
  computed: {
    stages() {
      return this.$store.state.StageModule.stages;
    },
  },

  methods: {
    getStages() {
      this.$store.dispatch("StageModule/getStages");
    },
    addSemester() {
      var data = {
        name: this.name,
        max_degree: this.max_degree,
        class_id: this.class_id,
      };
      this.$store.dispatch("SemesterModule/addSemester", data);
    },
    reset() {
      this.$refs.form.reset();
    },
  },
  created() {
    this.getStages();
  },
};
</script>
