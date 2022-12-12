<template>
  <v-card class="elevation-1">
    <v-data-table
      :headers="headers"
      :items="payments"
      :options.sync="pagination"
      :page.sync="pagination.page"
      :items-per-page="pagination.itemsPerPage"
      :loading="table_loading || false"
      hide-default-footer
      loading-text="جاري التحميل يرجى الأنتظار"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>جدول المدفوعات</v-toolbar-title>
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
          <td class="text-start">{{ item.value }}</td>
          <td class="text-start">{{ item.user.full_name }}</td>
          <td class="text-start">{{ item.pay_date }}</td>
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
          text: "قيمة الدفع",
          value: "value",
          class: "secondary white--text title",
        },
        {
          text: "اسم المستخدم",
          value: "user_id",
          class: "secondary white--text title",
        },
        {
          text: "تأريخ الدفع",
          value: "pay_date",
          class: "secondary white--text title",
        },
      ],
      pagination: {},
      items: [5, 10, 25, 50, 100],
    };
  },
  computed: {
    userQuery: {
      set(val) {
        this.$store.state.PaymentModule.paymentQuery = val;
      },
      get() {
        return this.$store.state.PaymentModule.paymentQuery;
      },
    },
    pageCount: function () {
      return this.$store.state.PaymentModule.pageCount;
    },
    totalItems: function () {
      return this.$store.state.PaymentModule.payments.length;
    },
    payments() {
      return this.$store.state.PaymentModule.payments;
    },
    table_loading() {
      return this.$store.state.PaymentModule.table_loading;
    },
    payment_params: {
      set(val) {
        this.$store.state.PaymentModule.params = val;
      },
      get() {
        return this.$store.state.PaymentModule.params;
      },
    },
  },
  methods: {
    queryChange(val) {
      this.searchDebounce();
    },
    getPayments() {
      let pagination = this.pagination;
      let par = {
        ...pagination,
      };
      // // console.log(this.query);
      this.payment_params = par;
      this.$store.dispatch("PaymentModule/getPayments");
    },
    searchDebounce() {
      clearTimeout(this._timerId);
      // delay new call 1000ms
      this._timerId = setTimeout(() => {
        this.$store.dispatch("PaymentModule/resetFields");
        this.pagination.page = 1;
        // console.log(this.userQuery);
        this.getPayments();
      }, 1000);
    },
    changeSort(column) {
      let pagination = this.payment_params;
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
      this.$store.dispatch("PaymentModule/resetFields");
      this.payment_params.page = 1;
      this.payment_params.sortBy = pagination.sortBy;
      this.payment_params.sortDesc = pagination.sortDesc;
    },
  },
  created() {
    this.$store.dispatch("PaymentModule/resetFields");
  },
  watch: {
    pagination: {
      handler() {
        this.getPayments();
      },
      deep: true,
    },
  },
};
</script>
<style></style>
