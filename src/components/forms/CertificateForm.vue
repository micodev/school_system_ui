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
              label="الصف"
              @change="onChange"
            ></v-autocomplete>
          </v-col>

          <v-col class="d-flex" cols="12" sm="4">
            <v-autocomplete
              clearable
              :items="users"
              ref="userDropdown"
              v-model="user_id"
              @change="onUserChange"
              item-text="full_name"
              item-value="id"
              label="اختر طالب"
              :disabled="loading"
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
    userQuery: {
      get() {
        return this.$store.state.UserModule.userQuery;
      },
      set(value) {
        this.$store.state.UserModule.userQuery = value;
      },
    },
    loading() {
      return this.$store.state.UserModule.table_loading;
    },
    stages() {
      return this.$store.state.StageModule.stages;
    },
    users() {
      return this.$store.state.UserModule.users;
    },
    materials() {
      return this.$store.state.MaterialModule.materials;
    },
    user_id: {
      set: function (val) {
        console.log("user_id set : " + val);
        this.$store.state.CertificateModule.user_id = val;
      },
      get: function () {
        return this.$store.state.CertificateModule.user_id;
      },
    },
  },

  methods: {
    onChange() {
      // stage
      var filter = { name: "class_id" };
      filter["value"] = [this.class_id];
      this.$store.dispatch("UserModule/resetFields");
      this.$store.dispatch("CertificateModule/resetFields");
      this.$store.dispatch("MaterialModule/resetFields");
      this.$store.dispatch("SemesterModule/resetFields");
      this.$store.state.UserModule.filter = filter;
      this.userQuery = "";
      this.$store.state.CertificateModule.class_id = this.class_id;
      this.$store.dispatch("UserModule/getUsers");
    },
    onUserChange() {
      this.isSelection = true;

      this.$store.state.CertificateModule.user_id = this.user_id;
      var class_id = this.$store.state.CertificateModule.class_id;
      this.$store.state.SemesterModule.filter = {
        name: "class_id",
        value: [class_id],
      };
      this.$store.state.MaterialModule.filter = {
        name: "class_id",
        value: [class_id],
      };
      this.$store.dispatch("SemesterModule/getSemesters");
      this.$store.dispatch("MaterialModule/getMaterials");
      this.$store.dispatch("CertificateModule/getCertificate");
    },
    getStages() {
      this.$store.dispatch("StageModule/getStages");
    },
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
        // this.$store.state.UserModule.params.query = this.userQuery;
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

    reset() {
      this.$refs.form.reset();
    },
    addExam() {
      let data = {};
      data["class_id"] = this.class_id;
      data["teacher_id"] = this.user_id;
      this.$store.dispatch("StageMaterialTeacherModule/addSMT", data);
    },
  },
  mounted() {
    this.getStages();
  },
  watch: {
    userQuery: function () {
      if (this.isSelection) {
        this.isSelection = false;
        return;
      }
      this.updateUserSearch(this.userQuery);
    },

    stages(val) {
      // // console.log(val);
      this.$store.dispatch("SemesterModule/resetFields");
      this.$store.dispatch("MaterialModule/resetFields");
      this.$store.dispatch("UserModule/resetFields");
      this.$store.state.CertificateModule.defaultClass_id = this.stages[0].id;
      var filter = { name: "class_id" };
      filter["value"] = [this.stages[0].id];
      // // console.log(filter);
      this.$store.state.UserModule.filter = filter;
      this.class_id = this.stages[0].id;
      this.$store.state.CertificateModule.class_id = this.class_id;
      // this.$store.dispatch("UserModule/getUsers");

      // console.log(this.$store.state.UserModule.users.length);

      // this.$store.dispatch("CertificateModule/getCertificate");
    },
  },
  beforeDestroy(){
    this.$store.dispatch("CertificateModule/resetFields");
     this.$store.dispatch("StageModule/resetFields");
  }
};
</script>
