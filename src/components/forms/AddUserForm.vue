<template>
  <v-container>
    <v-form ref="form" class="mr-10">
      <v-col cols="12" md="12" lg="12">
        <v-row>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="full_name"
              placeholder="الاسم الكامل"
              label="الاسم الكامل"
              hide-details="auto"
              :rules="rules"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="user_name"
              placeholder="اسم المستخدم"
              label="اسم المستخدم"
              hide-details="auto"
              :rules="rules"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="password"
              placeholder="كلمة المرور"
              label="كلمة المرور"
              hide-details="auto"
              :rules="rules"
              clearable
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="address"
              placeholder="عنوان المستخدم"
              label="عنوان المستخدم"
              hide-details="auto"
              :rules="rules"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="phone_number"
              placeholder="رقم الهاتف"
              label="رقم الهاتف"
              hide-details="auto"
              :rules="rules"
              clearable
            ></v-text-field>
          </v-col>
          <v-col class="d-flex" cols="12" sm="4">
            <v-autocomplete
              clearable
              :items="items"
              v-model="gender"
              item-text="type"
              item-value="id"
              label="الجنس"
            ></v-autocomplete>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="4">
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
                  v-model="birth_day"
                  label="تأريخ الميلاد "
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="birth_day"
                @input="menu = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="12" sm="4">
            <v-autocomplete
              clearable
              :items="schools"
              v-model="school_id"
              item-text="name"
              item-value="id"
              label="المدرسة"
              @change="onChange"
            ></v-autocomplete>
          </v-col>
          <v-col class="d-flex" cols="12" sm="4">
            <v-autocomplete
              clearable
              :items="user_type_arr"
              v-model="user_type"
              item-text="type"
              item-value="id"
              label="نوع المستخدم"
            ></v-autocomplete>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="4">
            <v-text-field
              v-if="this.user_type == 2"
              v-model="salary"
              placeholder="راتب التدريسي "
              label="راتب التدريسي "
              hide-details="auto"
              :rules="rules"
              clearable
            ></v-text-field>
            <v-text-field
              v-if="this.user_type == 3"
              v-model="discount_value"
              placeholder="قيمة التخفيض"
              label="قيمة التخفيض"
              hide-details="auto"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-if="this.user_type == 3"
              v-model="parent_job"
              placeholder="مهنة الاب "
              label="مهنة الاب "
              hide-details="auto"
              clearable
            ></v-text-field>
          </v-col>

          <v-col class="d-flex" cols="12" sm="4">
            <v-autocomplete
              v-if="this.user_type == 3"
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
                <v-btn secondary color="secondary" @click="validateField">
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
    </v-form></v-container
  >
</template>
<script>
export default {
  data() {
    return {
      rules: [(value) => !!value || "هذا الحقل مطلوب."],
      items: [
        { id: 0, type: "انثى" },
        { id: 1, type: "ذكر" },
      ],
      user_type_arr: [
        { id: 1, type: "مدير" },
        { id: 2, type: "معلم" },
        { id: 3, type: "طالب" },
      ],
      user_name: "",
      full_name: "",
      password: "",
      gender: "",
      phone_number: "",
      address: "",
      discount_value: "",
      salary: "",
      class_id: "",
      birth_day: "",
      parent_job: "",
      user_type: null,
      school_id: "",
      menu: false,
    };
  },
  computed: {
    stages() {
      return this.$store.state.StageModule.stages;
    },
    schools() {
      return this.$store.state.SchoolModule.schools;
    },
  },
  methods: {
    addUser(data) {
      // // console.log(data);
      this.$store.dispatch("UserModule/addUser", data);
    },
    // getStages() {
    //   this.$store.dispatch("StageModule/getStages");
    // },
    onChange() {
      // console.log(this.school_id);
      this.$store.state.StageModule.school_id = this.school_id;
      this.$store.dispatch("StageModule/getStages");
    },
    getSchools() {
      this.$store.dispatch("SchoolModule/getSchools");
    },
    validateField() {
      if (this.$refs.form.validate()) {
        let data = {};
        data["user_name"] = this.user_name;
        data["full_name"] = this.full_name;
        data["password"] = this.password;
        data["address"] = this.address;
        data["phone_number"] = this.phone_number;
        data["gender"] = this.gender;
        data["discount_value"] = this.discount_value;
        data["salary"] = this.salary;
        data["class_id"] = this.class_id;
        data["birth_day"] = this.birth_day;
        data["parent_job"] = this.parent_job;
        data["user_type"] = this.user_type;
        data["school_id"] = this.school_id;

        this.addUser(data);
      }
    },
    reset() {
      this.$refs.form.reset();
    },
  },
  created() {
    // this.getStages();
    this.getSchools();
  },
};
</script>
