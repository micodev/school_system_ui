<template>
  <v-container>
    <v-form ref="form" class="mr-10">
      <v-col cols="12" md="12" lg="12">
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="name"
              placeholder="اسم الصف "
              label="اسم الصف "
              hide-details="auto"
              :rules="rules"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="fee"
              placeholder="قيمة القسط"
              label="قيمة القسط"
              hide-details="auto"
              :rules="rules"
              clearable
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" align-self="center" class="text-center">
            <v-row justify="center">
              <v-col cols="auto">
                <v-btn secondary color="secondary" @click="addStage">
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
      fee: "",
    };
  },

  methods: {
    addStage() {
      var data = {
        name: this.name,
        fee: this.fee,
      };
      this.$store.dispatch("StageModule/addStage", data);
    },
    reset() {
      this.$refs.form.reset();
    },
  },
};
</script>
