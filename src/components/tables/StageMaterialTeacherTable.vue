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
              ><b>سوف تقوم بحذف الارتباط </b></v-card-text
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
                @click="deleteSMT()"
              >
                تأكيد الحذف
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template>
    <v-data-table
      :headers="headers"
      :items="SMTs"
      :loading="table_loading || false"
      :options.sync="pagination"
      :page.sync="pagination.page"
      :items-per-page="pagination.itemsPerPage"
      hide-default-footer
      loading-text="جاري التحميل يرجى الأنتظار"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>توزيع المحاضرين</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="SMTQuery"
            @input="queryChange"
            append-icon="mdi-magnify"
            label="بحث"
            single-line
            hide-details
            class="mr-5"
          ></v-text-field>
        </v-toolbar>
      </template>
      <!-- <th
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
      </th> -->
      <template v-slot:item="{ item }">
        <tr>
          <td class="text-start">{{ item.user.full_name }}</td>
          <td class="text-start">{{ item.material.name }}</td>
          <td class="text-start">{{ item.stage.name }}</td>
          <td>
            <v-btn dark color="red" @click="getItem(item)">حذف </v-btn>
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
          text: "المدرس",
          value: "user_id",
          class: "secondary white--text title",
        },
        {
          text: "المادة",
          value: "material_id",
          class: "secondary white--text title",
        },
        {
          text: "المرحلة",
          value: "class_id",
          class: "secondary white--text title",
        },
        {
          text: "الحذف",
          class: "secondary white--text title",
        },
      ],
      item: {},
      pagination: {},
      items: [5, 10, 25, 50, 100],
    };
  },

  computed: {
    SMTQuery: {
      set(val) {
        this.$store.state.StageMaterialTeacherModule.SMTQuery = val;
      },
      get() {
        return this.$store.state.StageMaterialTeacherModule.SMTQuery;
      },
    },
    pageCount: function () {
      return this.$store.state.StageMaterialTeacherModule.pageCount;
    },
    totalItems: function () {
      return this.$store.state.StageMaterialTeacherModule.SMTs.length;
    },
    SMTs() {
      return this.$store.state.StageMaterialTeacherModule.SMTs;
    },
    table_loading() {
      return this.$store.state.StageMaterialTeacherModule.table_loading;
    },
    SMT_params: {
      set(val) {
        this.$store.state.StageMaterialTeacherModule.params = val;
      },
      get() {
        return this.$store.state.StageMaterialTeacherModule.params;
      },
    },
  },
  methods: {
    queryChange(val) {
      this.searchDebounce();
    },
    getItem(item) {
      this.dialog = true;
      this.item = item;
    },
    deleteSMT() {
      this.$store.dispatch("StageMaterialTeacherModule/deleteSMT", this.item);
      this.dialog = false;
      this.item = {};
    },
    getSMTs() {
      let pagination = this.pagination;
      let par = {
        ...pagination,
      };
      this.SMT_params = par;
      this.$store.dispatch("StageMaterialTeacherModule/getSMTs");
    },
    searchDebounce() {
      clearTimeout(this._timerId);
      // delay new call 1000ms
      this._timerId = setTimeout(() => {
        this.$store.dispatch("StageMaterialTeacherModule/resetFields");
        this.pagination.page = 1;
        this.getSMTs();
      }, 1000);
    },
    changeSort(column) {
      let pagination = this.SMT_params;
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
      this.$store.dispatch("StageMaterialTeacherModule/resetFields");
      this.SMT_params.page = 1;
      this.SMT_params.sortBy = pagination.sortBy;
      this.SMT_params.sortDesc = pagination.sortDesc;
    },
  },
  created() {
    this.$store.dispatch("StageMaterialTeacherModule/resetFields");
  },

  watch: {
    pagination: {
      handler() {
        this.getSMTs();
        this.SMT_params.page = 1;
      },
      deep: true,
    },
  },
};
</script>
<style></style>
