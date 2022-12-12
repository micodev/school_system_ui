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

    <template>
      <v-row justify="center">
        <v-dialog v-model="dialog3" persistent max-width="390">
          <v-card>
            <v-card-title class="text-h5 secondary white--text">
              <b v-if="this.item.hide_degree == 0"> اخفاء الشهادة</b>
              <b v-else>عرض الشهادة</b>
            </v-card-title>
            <v-card-text class="mt-5 text-h5 dark--text">
              <b v-if="this.item.hide_degree == 0">
                سوف يتم اخفاء الشهادة على الطالب
                <b style="color: blue">{{ this.item.full_name }}</b>
                لايمكنه مشاهدة درجاته بعد الأن
              </b>
              <b v-else
                >سوف يتم الغاء اخفاء الشهادة على الطالب
                <b style="color: blue">{{ this.item.full_name }}</b></b
              >
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                class="secondary"
                color="white darken-1"
                text
                @click="dialog3 = false"
              >
                غلق
              </v-btn>
              <v-btn
                class="secondary"
                color="white darken-1"
                text
                @click="hideDegree()"
              >
                تأكيد
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template>
    <v-data-table
      :headers="headers"
      :items="users"
      :options.sync="pagination"
      :page.sync="pagination.page"
      :items-per-page="pagination.itemsPerPage"
      :loading="table_loading || false"
      hide-default-footer
      loading-text="جاري التحميل يرجى الأنتظار"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>جدول الطلاب</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="userQuery"
            @input="queryChange"
            append-icon="mdi-magnify"
            label="بحث"
            single-line
            hide-details
            class="mr-5"
          ></v-text-field>
        </v-toolbar>
      </template>
      <th
        v-for="header in headers"
        :key="header.text"
        :class="[
          'column sortable',
          pagination.descending ? 'desc' : 'asc',
          header.value === pagination.sortBy ? 'active' : '',
        ]"
        @click="changeSort(header.value)"
      >
        <v-icon small>arrow_upward</v-icon>
        {{ header.text }}
      </th>

      <template v-slot:item="{ item }">
        <tr>
          <td class="text-start">{{ item.full_name }}</td>
          <td class="text-start">{{ item.user_name }}</td>
          <td class="text-start" v-if="!item.phone_number">
            <span style="color: red">لايوجد رقم هاتف</span>
          </td>
          <td class="text-start" v-else>{{ item.phone_number }}</td>

          <td class="text-start" v-if="!item.discount_value">
            <span style="color: red">لايوجد تخفيض</span>
          </td>
          <td class="text-start" v-else>{{ item.discount_value }}</td>
          <td class="text-start">{{ item.stage.name }}</td>
          <td class="text-start" v-if="item.paid == 1">
            <span style="color: blue" class="text-end font-weight-bold">{{
              item.fee
            }}</span>

            <span><b>د.ع</b></span>
          </td>
          <td v-else class="text-start">
            <span style="color: blue" class="text-end font-weight-bold"
              >مكتمل</span
            >
          </td>
          <td>
            <v-col>
              <v-row class="pt-1">
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
              <v-row class="pt-1 pb-1">
                <v-btn
                  small
                  block
                  dark
                  color="info"
                  @click="getItemHideDegree(item)"
                  v-if="item.hide_degree == 0"
                  >اخفاءالشهادة
                </v-btn>
                <v-btn
                  small
                  block
                  dark
                  color="info"
                  @click="getItemHideDegree(item)"
                  v-else
                  >عرض الشهادة
                </v-btn>
              </v-row>
              <v-row class="pb-1">
                <v-btn small block dark color="red" @click="getItem(item)"
                  >حذف
                </v-btn>
              </v-row>
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
      dialog: false,
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
          text: " التخفيض ",
          value: "discount_value",
          class: "secondary white--text title",
        },
        {
          text: "ألصف",
          value: "class_id",
          class: "secondary white--text title",
        },
        {
          text: "القسط",
          value: "paid",
          class: "secondary white--text title",
        },
        {
          text: "العمليات",
          class: "secondary white--text title",
        },
      ],
      item: {},
      pagination: {},
      items: [5, 10, 25, 50, 100],
      dialog2: false,
      dialog3: false,
    };
  },
  computed: {
    userQuery: {
      set(val) {
        this.$store.state.UserModule.userQuery = val;
      },
      get() {
        return this.$store.state.UserModule.userQuery;
      },
    },
    pageCount: function () {
      return this.$store.state.UserModule.pageCount;
    },
    totalItems: function () {
      return this.$store.state.UserModule.users.length;
    },
    users() {
      return this.$store.state.UserModule.users;
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
    getItemHideDegree(item) {
      this.item = item;
      this.dialog3 = true;
      // console.log(item);
      // this.$store.dispatch("UserModule/hideDegree", item.id);
    },

    hideDegree() {
      this.$store.dispatch("UserModule/hideDegree", this.item);
      this.dialog3 = false;
    },

    selecteID(item) {
      // console.log(item.id);
      this.$store.dispatch("UserModule/getUserInfo", item.id);
      this.dialog2 = true;
    },
    queryChange(val) {
      this.searchDebounce();
    },
    getUsers() {
      let pagination = this.pagination;

      let par = {
        ...pagination,
        dropdown: false,
      };
      // // console.log(this.query);
      this.user_params = par;
      this.$store.dispatch("UserModule/getUsers");
    },

    searchDebounce() {
      clearTimeout(this._timerId);
      // delay new call 1000ms
      this._timerId = setTimeout(() => {
        this.$store.dispatch("UserModule/resetFields");

        this.pagination.page = 1;
        // console.log(this.userQuery);
        this.getUsers();
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
  },
  mounted() {
    // this.getUsers();
    this.$store.dispatch("UserModule/resetFields");
  },

  watch: {
    pagination: {
      handler() {
        this.getUsers();
      },
      deep: true,
    },
  },
  beforeDestroy(){
    
    this.userQuery = ""
  }
};
</script>
<style>
.highlight {
  background-color: #f5f5f5;
}
tr:hover {
  cursor: pointer;
}
.theme--light.v-data-table
  .v-data-table-header
  th.sortable.active
  .v-data-table-header__icon {
  color: #f5f5f5 !important;
}
</style>
