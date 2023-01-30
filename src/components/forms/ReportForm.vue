<template>
  <v-container>
    <v-form ref="form" class="mr-10">
      <v-row>
        <v-col class="d-flex" cols="12" sm="4">
          <v-autocomplete
            clearable
            :items="report_type_arr"
            v-model="report_type"
            item-text="type"
            item-value="id"
            label="نوع التبليغ"
          ></v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6">
          <v-textarea
            clearable
            class="mx-2"
            label="اكتب هنا ..."
            rows="1"
            value="قم بأدخال نص التبليغ  "
            hint="قم بأدخال نص التبليغ  "
            v-model="body"
          ></v-textarea>
        </v-col>
        <v-col class="d-flex" cols="12" sm="2">
          <v-autocomplete
            v-if="this.report_type == 0"
            clearable
            ref="userDropdown"
            :items="users"
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
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" align-self="center" class="text-center">
          <v-row justify="center">
            <v-col cols="auto">
              <v-btn secondary color="secondary" @click="addReport">
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
      report_type_arr: [
        { id: 1, type: "عام" },
        { id: 0, type: "غياب" },
      ],
      report_type: null,
      user_id: "",
      body: "",
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
    loading() {
      return this.$store.state.UserModule.table_loading;
    },
    userQuery: {
      get() {
        return this.$store.state.UserModule.userQuery;
      },
      set(value) {
        this.$store.state.UserModule.userQuery = value;
      },
    },
    users() {
      return this.$store.state.UserModule.users;
    },
  },

  methods: {
    updateUserSearch(value) {
      clearTimeout(this._timerId);
      // delay new call 1000ms
      this._timerId = setTimeout(() => {
        // console.log(this.userQuery);

        if (this.userQuery == null) {
          return;
        }
        this.$store.dispatch("UserModule/resetFields");
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
        this.$store.dispatch("UserModule/resetFields");
        this.getUsers();
      }, 1000);
    },
    getUsers() {
      if (this.$store.state.UserModule.user_state == "finished") return;

      this.$store.dispatch("UserModule/getUsers");
    },
    userInteract(entries, observer, isIntersecting) {
      if (isIntersecting) {
        setTimeout(() => {
          this.getUsers(); // onscroll
          // console.log("on scroll");
          this.$refs.userDropdown.onScroll();
        }, 500);
      }
    },
    addReport() {
      var data = {
        body: this.body,
        type: this.report_type,
      };
      if (this.report_type == 0) {
        data["user_id"] = this.user_id;
      }
      this.$store.dispatch("ReportModule/addReport", data);
    },
    reset() {
      this.$refs.form.reset();
    },
  },
  watch: {
    userQuery: function () {
      this.$store.dispatch("UserModule/resetFields");

      this.updateUserSearch(this.userQuery);
    },
  },
};
</script>
