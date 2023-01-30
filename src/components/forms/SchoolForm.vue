<template>
  <v-container>
    <v-form ref="form" class="mr-10">
      <v-col cols="12" md="12" lg="12">
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="name"
              placeholder="اسم الكلية "
              label="اسم الكلية "
              hide-details="auto"
              :rules="rules"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="address"
              placeholder="العنوان "
              label="العنوان "
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
                <v-btn secondary color="secondary" @click="addSchool">
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
      address: "",
    };
  },

  methods: {
    addSchool() {
      var data = {
        name: this.name,
        address: this.address,
      };
      this.$store.dispatch("SchoolModule/addSchool", data);
    },
    reset() {
      this.$refs.form.reset();
    },
  },
};
</script>
