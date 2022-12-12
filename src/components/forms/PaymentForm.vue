<template>
  <v-container>
    <v-form ref="form" class="mr-10">
      <v-row>
        <v-col cols="12" sm="4">
          <v-text-field
            v-model="value"
            placeholder="قيمة الدفع"
            label="قيمة الدفع"
            hide-details="auto"
            :rules="rules"
            clearable
          ></v-text-field>
        </v-col>
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
                v-model="pay_date"
                label="تأريخ الدفع "
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="pay_date"
              @input="menu = false"
            ></v-date-picker>
          </v-menu>
        </v-col>
        <v-col class="d-flex" cols="12" sm="4">
          <v-autocomplete
            clearable
            :items="user_type_arr"
            v-model="user_type"
            item-text="type"
            item-value="id"
            @change="onChange"
            label="نوع المستخدم"
          ></v-autocomplete>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="d-flex" cols="12" sm="4">
          <v-autocomplete
            clearable
            :class="user_type == 2 || user_type == null ? 'd-none' : ''"
            :items="users"
            ref="userDropdown"
            v-model="user_id"
            item-text="full_name"
            item-value="id"
            label="اختر طالب"
            :loading="loading"
            :menu-props="menu_props"
            :search-input.sync="userQuery"
            :value="userQuery"
          >
            <template v-slot:append-item>
              <div
                v-if="!($store.state.UserModule.user_state == 'finished')"
                v-intersect="userInteract"
                class="text-xs-center"
              ></div> </template
          ></v-autocomplete>
          <v-autocomplete
            clearable
            :class="user_type == 3 || user_type == null ? 'd-none' : ''"
            ref="teacherDropdown"
            :items="teachers"
            v-model="user_id"
            item-text="full_name"
            item-value="id"
            label="اختر مدرس"
            :loading="loading"
            :menu-props="menu_props1"
            :search-input.sync="teacherQuery"
            :value="teacherQuery"
          >
            <template v-slot:append-item>
              <div
                v-if="!($store.state.UserModule.teacher_state == 'finished')"
                v-intersect="teacherInteract"
                class="text-xs-center"
              ></div>
            </template>
          </v-autocomplete>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" align-self="center" class="text-center">
          <v-row justify="center">
            <v-col cols="auto">
              <v-btn secondary color="secondary" @click="addPayment">
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
    </v-form>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      rules: [(value) => !!value || "هذا الحقل مطلوب."],
      menu: false,
      user_type_arr: [
        { id: 2, type: "معلم" },
        { id: 3, type: "طالب" },
      ],
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
      menu_props1: {
        closeOnClick: false,
        closeOnContentClick: false,
        disableKeys: true,
        openOnClick: false,
        maxHeight: 150,
        offsetY: true,
        offsetOverflow: true,
        transition: false,
      },
      isSelection: false,

      user_type: null,
      user_id: "",
      pay_date: "",
      value: "",
    };
  },
  computed: {
    userQuery: {
      get() {
        return this.$store.state.UserModule.userQuery;
      },
      set(value) {
        this.$store.state.UserModule.userQuery = value;
      },
    },
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
    page: function () {
      return this.$store.state.UserModule.page;
    },
    users() {
      return this.$store.state.UserModule.users;
    },
    teachers() {
      return this.$store.state.UserModule.teachers;
    },
  },

  methods: {
    onChange() {
      // this.isSelection = true;

      this.$store.dispatch("UserModule/resetFields");
      console.log(this.user_type);
      // this.getUsers();
      // this.getTeachers();
    },
    updateUserSearch(value) {
      clearTimeout(this._timerId);
      // delay new call 1000ms
      this._timerId = setTimeout(() => {
        // console.log(this.userQuery);

        if (this.userQuery == null) {
          return;
        }
        // this.$store.dispatch("UserModule/resetFields");
        this.$store.state.UserModule.params.page = 1;
        // console.log(this.$store.state.UserModule.params);

        if (
          this.userQuery.length == 0 ||
          (this.userQuery.length == 1 && this.userQuery == " ")
        )
          this.userQuery = value.replace(/\s/g, "");
        // هاي تلغي ال space
        else {
          this.$store.state.UserModule.userQuery = value;
          // console.log(value);
          // console.log(this.$store.state.UserModule.userQuery);
        }
        // this.$store.state.UserModule.params.query = this.userQuery;
        // this.$store.dispatch("UserModule/resetFields");

        this.getUsers();
      }, 1000);
    },
    updateTeacherSearch(value) {
      clearTimeout(this._timerId);
      // delay new call 1000ms
      this._timerId = setTimeout(() => {
        if (this.teacherQuery == null) {
          return;
        }
        // this.$store.dispatch("UserModule/resetFields");
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
        // this.$store.dispatch("UserModule/resetFields");
        this.getTeachers();
      }, 1000);
    },

    getUsers() {
      if (this.$store.state.UserModule.user_state == "finished") return;
      this.$store.dispatch("UserModule/getUsers");
    },
    getTeachers() {
      if (this.$store.state.UserModule.teacher_state == "finished") return;
      this.$store.dispatch("UserModule/getTeachers");
    },
    userInteract(entries, observer, isIntersecting) {
      if (isIntersecting) {
        setTimeout(() => {
          this.getUsers(); // onscroll
          console.log("on scroll");
          this.$refs.userDropdown.onScroll();
        }, 500);
      }
    },
    teacherInteract(entries, observer, isIntersecting) {
      if (isIntersecting) {
        setTimeout(() => {
          this.getTeachers(); // onscroll
          console.log("on scroll teacher");
          this.$refs.teacherDropdown.onScroll();
        }, 500);
      }
    },

    addPayment() {
      var data = {
        user_id: this.user_id,
        pay_date: this.pay_date,
        value: this.value,
      };
      this.$store.dispatch("PaymentModule/addPayment", data);
      this.$store.dispatch("UserModule/resetFields");
      
    },
    reset() {
      this.$refs.form.reset();
    },
  },

  mounted() {
    this.$store.dispatch("UserModule/resetFields");
  },
  // created() {
  //   this.getUsers();
  //   this.getTeachers();
  // },

  watch: {
    userQuery: function () {
      this.updateUserSearch(this.userQuery);
    },
    teacherQuery: function () {
      // if (this.isSelection) {
      //   this.isSelection = false;
      //   return;
      // }
      this.updateTeacherSearch(this.teacherQuery);
    },
  },
  beforeDestroy(){
    this.teacherQuery = ""
    this.userQuery = ""
  }
};
</script>
