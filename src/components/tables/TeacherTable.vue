<template>
  <v-card class="elevation-1">
    <template>
      <v-row justify="center">
        <v-dialog v-model="dialog" persistent max-width="390">
          <v-card>
            <v-card-title class="text-h5 secondary white--text">
              هل أنت متأكد من عملية الحذف
            </v-card-title>
            <v-card-text class="mt-5 text-h5 dark--text"
              ><b
                >اذا قمت بحذف هذا المستخدم سيتم حذف كل مايتعلق به داخل النظام</b
              ></v-card-text
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                class="secondary"
                color="white darken-1"
                text
                @click="dialog = false"
              >
                غلق
              </v-btn>
              <v-btn
                class="secondary"
                color="white darken-1"
                text
                @click="deleteUser()"
              >
                تأكيد الحذف
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template>
    <template>
      <v-row justify="center">
        <v-dialog v-model="dialog2" persistent max-width="390">
          <v-card>
            <v-card-title class="text-h5 secondary white--text">
              عرض كلمة المرور
            </v-card-title>
            <v-card-text class="mt-5 text-h5 dark--text"
              >كلمة المرور الخاصة بهذا المستخدم
              <span style="color: blue"
                ><b>{{ password }}</b></span
              >
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                class="secondary"
                color="white darken-1"
                text
                @click="dialog2 = false"
              >
                غلق
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template>
    <v-data-table
      :headers="headers"
      :items="teachers"
      :options.sync="pagination"
      :page.sync="pagination.page"
      :items-per-page="pagination.itemsPerPage"
      :loading="table_loading || false"
      hide-default-footer
      loading-text="جاري التحميل يرجى الأنتظار"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>جدول المدرسين</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="teacherQuery"
            @input="queryChange"
            append-icon="mdi-magnify"
            label="بحث"
            single-line
            hide-details
            class="mr-5"
          ></v-text-field>
        </v-toolbar>
      </template>
      <template v-slot:item="{ item }">
        <tr>
          <td class="text-start">{{ item.full_name }}</td>
          <td class="text-start">{{ item.user_name }}</td>
          <td class="text-start" v-if="!item.phone_number">
            <span style="color: red">لايوجد رقم هاتف</span>
          </td>
          <td class="text-start" v-else>{{ item.phone_number }}</td>
          <td class="text-start">{{ item.address }}</td>
          <td class="text-start" v-if="!item.birth_day">
            <span style="color: red">لايوجد تأريخ ميلاد</span>
          </td>
          <td class="text-start" v-else>{{ item.birth_day }}</td>
          <td class="text-start" v-if="!item.salary">
            <span style="color: red">لايوجد تخفيض</span>
          </td>
          <td class="text-start" v-else>{{ item.salary }}</td>
          <td>
            <v-col>
              <v-row class="pt-1 pb-1">
                <v-btn
                  small
                  block
                  dark
                  color="secondary"
                  @click="selecteID(item)"
                >
                  كلمة المرور
                </v-btn>
              </v-row>
              <v-row class="pb-1">
                <v-btn dark small block color="red" @click="getItem(item)"
                  >حذف
                </v-btn></v-row
              >
            </v-col>
          </td>
        </tr>
      </template>
    </v-data-table>
    <div class="text-center pt-2">
      <v-row>
        <v-col offset="4" cols="2">
          <v-select
            v-model="pagination.itemsPerPage"
            :items="items"
            label="Items per page"
          ></v-select>
        </v-col>
        <v-col cols="6">
          <v-pagination
            v-model="pagination.page"
            :length="pageCount"
            circle
          ></v-pagination>
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>
<script>
export default {
  data() {
    return {
      headers: [
        {
          text: "الاسم الكامل",
          value: "full_name",
          class: "secondary white--text title",
        },
        {
          text: "اسم المستخدم",
          value: "user_name",
          class: "secondary white--text title",
        },
        {
          text: "رقم الهاتف",
          value: "phone_number",
          class: "secondary white--text title",
        },
        {
          text: "العنوان",
          value: "address",
          class: "secondary white--text title",
        },
        {
          text: "تأريخ الميلاد",
          value: "birth_day",
          class: "secondary white--text title",
        },

        {
          text: "الراتب",
          value: "salary",
          class: "secondary white--text title",
        },
        {
          text: "العمليات",
          class: "secondary white--text title",
        },
      ],
      item: {},
      dialog: false,
      pagination: {},
      items: [5, 10, 25, 50, 100],
      dialog2: false,
    };
  },
  computed: {
    teacherQuery: {
      set(val) {
        this.$store.state.UserModule.teacherQuery = val;
      },
      get() {
        return this.$store.state.UserModule.teacherQuery;
      },
    },
    pageCount: function () {
      return this.$store.state.UserModule.pageCount;
    },
    totalItems: function () {
      return this.$store.state.UserModule.teachers.length;
    },
    teachers() {
      return this.$store.state.UserModule.teachers;
    },
    table_loading() {
      return this.$store.state.UserModule.table_loading;
    },
    password() {
      return this.$store.state.UserModule.infoUser;
    },
    user_params: {
      set(val) {
        this.$store.state.UserModule.params = val;
      },
      get() {
        return this.$store.state.UserModule.params;
      },
    },
  },
  methods: {
    selecteID(item) {
      // console.log(item.id);
      this.$store.dispatch("UserModule/getUserInfo", item.id);
      this.dialog2 = true;
    },
    queryChange(val) {
      this.searchDebounce();
    },
    getTeachers() {
      let pagination = this.pagination;
      let par = {
        ...pagination,
        dropdown: false,
      };
      // // console.log(this.query);
      this.user_params = par;
      this.$store.dispatch("UserModule/getTeachers");
    },
    searchDebounce() {
      clearTimeout(this._timerId);
      // delay new call 1000ms
      this._timerId = setTimeout(() => {
        this.$store.dispatch("UserModule/resetFields");
        this.pagination.page = 1;
        // console.log(this.teacherQuery);
        this.getTeachers();
      }, 1000);
    },
    changeSort(column) {
      let pagination = this.user_params;
      if (pagination.sortBy[0] === column) {
        if (pagination.sortDesc[0] === true) {
          pagination.sortBy = [];
          pagination.sortDesc = [];
        } else {
          pagination.sortDesc = [true];
        }
      } else {
        pagination.sortBy = [column];
        pagination.sortDesc = [false];
      }
      this.$store.dispatch("UserModule/resetFields");
      this.user_params.page = 1;
      this.user_params.sortBy = pagination.sortBy;
      this.user_params.sortDesc = pagination.sortDesc;
    },
    getItem(item) {
      this.dialog = true;
      this.item = item;
    },
    deleteUser() {
      this.$store.dispatch("UserModule/deleteUser", this.item);
      this.dialog = false;
      this.item = {};
    },
    // getTeachers() {
    //   this.$store.dispatch("UserModule/getTeachers");
    // },
    // rowClicked(item) {
    //   Object.assign(this.$store.state.UserModule.selected_object, item);
    // },
  },
  created() {
    // this.getTeachers();
    this.$store.dispatch("UserModule/resetFields");
  },
  watch: {
    pagination: {
      handler() {
        this.getTeachers();
        this.user_params.page = 1;
      },
      deep: true,
    },
  },
   beforeDestroy(){
    this.teacherQuery = ""
  }
};
</script>
<style></style>
