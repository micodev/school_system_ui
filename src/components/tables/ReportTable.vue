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
              ><b>تأكيد عملية الحذف</b></v-card-text
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
                @click="deleteReport()"
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
      :items="reports"
      :options.sync="pagination"
      :page.sync="pagination.page"
      :items-per-page="pagination.itemsPerPage"
      hide-default-footer
      loading-text="جاري التحميل يرجى الأنتظار"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-btn
            dark
            color="secondary"
            class="ml-4"
            @click.prevent="reloadPage"
          >
            تحميل البيانات</v-btn
          >
          <v-toolbar-title>جدول التبليغات</v-toolbar-title>

          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="reportQuery"
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
          <td class="text-start">
            <span v-if="item.type == 0"> <b>تبليغ غياب</b> </span>
            <span v-else-if="item.type == 1"> <b>تبليغ عام</b> </span>
            <span v-else-if="item.type == 2"> <b>تبليغ خاص</b> </span>
            <span v-else-if="item.type == 3"> <b>تبليغ امتحان</b> </span>
            <span v-else-if="item.type == 4"> <b>تبليغ واجب</b> </span>
          </td>
          <td class="text-start">{{ item.issuer.full_name }}</td>
          <td class="text-start" v-if="!item.body">
            <span style="color: red">لايوجد </span>
          </td>
          <td v-else class="text-start">{{ item.body }}</td>
          <td class="text-start" v-if="!item.user">
            <span style="color: red">لايوجد </span>
          </td>
          <td class="text-start" v-else>{{ item.user.full_name }}</td>

          <td class="text-start" v-if="!item.material">
            <span style="color: red">لايوجد </span>
          </td>
          <td class="text-start" v-else>{{ item.material.name }}</td>

          <td class="text-start" v-if="!item.stage">
            <span style="color: red">لايوجد </span>
          </td>
          <td class="text-start" v-else>{{ item.stage.name }}</td>

          <td class="text-start">
            <v-btn dark color="red" @click="getItem(item)">حذف </v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>
    <div class="text-center pt-2 mt-3">
      <v-row>
        <v-col offset="1" cols="auto" align-self="center"> عرض حسب </v-col>
        <v-col cols="2" align-self="center">
          <v-select
            @change="filterChange"
            v-model="filter"
            :items="reqFilters"
            item-value="text"
            return-object
            single-line
            label="عرض حسب"
          ></v-select>
        </v-col>
        <v-col align-self="center" cols="2" offset="2">
          <v-select
            v-model="pagination.itemsPerPage"
            :items="items"
            label="Items per page"
          ></v-select>
        </v-col>
        <v-col align-self="center" cols="4">
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
      search: "",
      dialog: false,
      item: {},

      headers: [
        {
          text: "نوع التبليغ ",
          value: "type",
          class: "secondary white--text title",
        },
        {
          text: "المبلغ",
          value: "issuer",
          class: "secondary white--text title",
        },
        {
          text: "النص",
          value: "body",
          class: "secondary white--text title",
        },

        {
          text: "المستخدم",
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
      pagination: {},
      items: [5, 10, 25, 50, 100],
      reqFilters: [
        { name: "type", value: 0, text: "الكل" },
        { name: "type", value: 0, text: "غياب" },
        { name: "type", value: 1, text: "عام" },
        { name: "type", value: 2, text: "خاص" },
        { name: "type", value: 3, text: "امتحان" },
        { name: "type", value: 4, text: "واجب" },
      ],
    };
  },
  computed: {
    reportQuery: {
      set(val) {
        this.$store.state.ReportModule.reportQuery = val;
      },
      get() {
        return this.$store.state.ReportModule.reportQuery;
      },
    },
    pageCount: function () {
      return this.$store.state.ReportModule.pageCount;
    },
    totalItems: function () {
      return this.$store.state.ReportModule.reports.length;
    },
    reports() {
      return this.$store.state.ReportModule.reports;
    },
    table_loading() {
      return this.$store.state.ReportModule.table_loading;
    },
    report_params: {
      set(val) {
        this.$store.state.ReportModule.params = val;
      },
      get() {
        return this.$store.state.ReportModule.params;
      },
    },
    filter: {
      get() {
        return this.$store.state.ReportModule.filter;
      },
      set(value) {
        this.$store.state.ReportModule.filter = value;
      },
    },
  },
  methods: {
    reloadPage() {
      this.$store.dispatch("ReportModule/resetFields");
      this.getReports();
    },
    filterChange() {
      // console.log(this.reqFilters);
      this.getReports();
    },
    queryChange(val) {
      this.searchDebounce();
    },
    getItem(item) {
      this.dialog = true;
      this.item = item;
    },
    deleteReport() {
      this.$store.dispatch("ReportModule/deleteReport", this.item);
      this.dialog = false;
      this.item = {};
    },
    getReports() {
      let pagination = this.pagination;
      let par = {
        ...pagination,
      };
      // // console.log(this.query);
      this.report_params = par;
      this.$store.dispatch("ReportModule/getReports");
    },
    searchDebounce() {
      clearTimeout(this._timerId);
      // delay new call 1000ms
      this._timerId = setTimeout(() => {
        this.$store.dispatch("ReportModule/resetFields");
        this.pagination.page = 1;
        // console.log(this.reportQuery);
        this.getReports();
      }, 1000);
    },
    changeSort(column) {
      let pagination = this.report_params;
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
      this.$store.dispatch("ReportModule/resetFields");
      this.report_params.page = 1;
      this.report_params.sortBy = pagination.sortBy;
      this.report_params.sortDesc = pagination.sortDesc;
    },
  },
  created() {
    // this.getReports();
    this.$store.dispatch("ReportModule/resetFields");
  },
  watch: {
    pagination: {
      handler() {
        this.getReports();
        this.report_params.page = 1;
      },
      deep: true,
    },
  },
};
</script>
<style></style>
