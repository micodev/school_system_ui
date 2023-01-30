<template>
  <v-card class="elevation-1">
    <v-data-table
      :headers="headers"
      :items="feedbacks"
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
          <v-toolbar-title>مشاركات اولياء الامور</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="feedbackQuery"
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
          <td class="text-start" style="width: 400px">{{ item.text }}</td>
          <td class="text-start">{{ item.user.full_name }}</td>
          <td class="text-start" v-if="item.user.phone_number">
            {{ item.user.phone_number }}
          </td>
          <td class="text-start" v-else>
            <span style="color: red">لايوجد رقم هاتف</span>
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
          text: "النص ",
          value: "text",
          class: "secondary white--text title",
        },
        {
          text: "اسم المستخدم",
          value: "user_id",
          class: "secondary white--text title",
        },
        {
          text: "رقم هاتف المستخدم",
          value: "user_id",
          class: "secondary white--text title",
        },
      ],
      pagination: {},
      items: [5, 10, 25, 50, 100],
    };
  },
  computed: {
    feedbackQuery: {
      set(val) {
        this.$store.state.FeedbackModule.feedbackQuery = val;
      },
      get() {
        return this.$store.state.FeedbackModule.feedbackQuery;
      },
    },
    pageCount: function () {
      return this.$store.state.FeedbackModule.pageCount;
    },
    totalItems: function () {
      return this.$store.state.FeedbackModule.feedbacks.length;
    },
    feedbacks() {
      return this.$store.state.FeedbackModule.feedbacks;
    },
    table_loading() {
      return this.$store.state.FeedbackModule.table_loading;
    },
    feedback_params: {
      set(val) {
        this.$store.state.FeedbackModule.params = val;
      },
      get() {
        return this.$store.state.FeedbackModule.params;
      },
    },
  },
  methods: {
    reloadPage() {
      this.$store.dispatch("FeedbackModule/resetFields");
      this.getFeedbacks();
    },
    queryChange(val) {
      this.searchDebounce();
    },
    getFeedbacks() {
      let pagination = this.pagination;
      let par = {
        ...pagination,
      };
      this.feedback_params = par;
      this.$store.dispatch("FeedbackModule/getFeedbacks");
    },
    searchDebounce() {
      clearTimeout(this._timerId);
      // delay new call 1000ms
      this._timerId = setTimeout(() => {
        this.$store.dispatch("FeedbackModule/resetFields");
        this.pagination.page = 1;
        this.getFeedbacks();
      }, 1000);
    },
    changeSort(column) {
      let pagination = this.feedback_params;
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
      this.$store.dispatch("FeedbackModule/resetFields");
      this.feedback_params.page = 1;
      this.feedback_params.sortBy = pagination.sortBy;
      this.feedback_params.sortDesc = pagination.sortDesc;
    },
  },
  created() {
    this.$store.dispatch("FeedbackModule/resetFields");
  },
  watch: {
    pagination: {
      handler() {
        this.getFeedbacks();
        this.feedback_params.page = 1;
      },
      deep: true,
    },
  },
};
</script>
<style></style>
