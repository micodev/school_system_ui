<template>
  <v-card class="elevation-1">
    <v-data-table
      :headers="headers"
      :items="semesters"
      :options.sync="pagination"
      :page.sync="pagination.page"
      :items-per-page="pagination.itemsPerPage"
      :loading="table_loading || false"
      hide-default-footer
      loading-text="جاري التحميل يرجى الأنتظار"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>جدول الفصول الدراسية</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="semesterQuery"
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
          <td class="text-start">{{ item.name }}</td>
          <td class="text-start">{{ item.max_degree }}</td>
          <td class="text-start">{{ item.stage.name }}</td>
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
      search: "",
      headers: [
        {
          text: "الفصل",
          value: "name",
          class: "secondary white--text title",
        },
        {
          text: "الدرجة",
          value: "max_degree",
          class: "secondary white--text title",
        },
        {
          text: "الصف",
          value: "class_id",
          class: "secondary white--text title",
        },
      ],
      item: {},
      dialog: false,
      pagination: {},
      items: [5, 10, 25, 50, 100],
    };
  },
  computed: {
    semesterQuery: {
      set(val) {
        this.$store.state.SemesterModule.semesterQuery = val;
      },
      get() {
        return this.$store.state.SemesterModule.semesterQuery;
      },
    },
    pageCount: function () {
      return this.$store.state.SemesterModule.pageCount;
    },
    totalItems: function () {
      return this.$store.state.SemesterModule.semesters.length;
    },
    semesters() {
      return this.$store.state.SemesterModule.semesters;
    },
    table_loading() {
      return this.$store.state.SemesterModule.table_loading;
    },
    semester_params: {
      set(val) {
        this.$store.state.SemesterModule.params = val;
      },
      get() {
        return this.$store.state.SemesterModule.params;
      },
    },
  },
  methods: {
    queryChange(val) {
      this.searchDebounce();
    },
    getSemesters() {
      let pagination = this.pagination;
      let par = {
        ...pagination,
      };
      this.semester_params = par;
      this.$store.dispatch("SemesterModule/getSemesters");
    },
    searchDebounce() {
      clearTimeout(this._timerId);
      // delay new call 1000ms
      this._timerId = setTimeout(() => {
        this.$store.dispatch("SemesterModule/resetFields");
        this.pagination.page = 1;
        this.getSemesters();
      }, 1000);
    },
    changeSort(column) {
      let pagination = this.semester_params;
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
      this.$store.dispatch("SemesterModule/resetFields");
      this.semester_params.page = 1;
      this.semester_params.sortBy = pagination.sortBy;
      this.semester_params.sortDesc = pagination.sortDesc;
    },
  },
  created() {
    this.$store.dispatch("SemesterModule/resetFields");
  },
  watch: {
    pagination: {
      handler() {
        this.getSemesters();
      },
      deep: true,
    },
  },
};
</script>
<style></style>
