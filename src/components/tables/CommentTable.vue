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
              ><b>سوف تقوم بحذف التعليق</b></v-card-text
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
                @click="deleteComment()"
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
              رد على تعليق
            </v-card-title>
            <v-card-text class="mt-5 text-h5 dark--text">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    label="التعليق"
                    disabled
                    v-model="item.body"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="12">
                  <v-textarea
                    clearable
                    class="mx-2"
                    label="اكتب هنا ..."
                    rows="1"
                    value="اضف رد"
                    hint="اضف رد"
                    v-model="replay"
                  ></v-textarea>
                </v-col>
              </v-row>
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
              <v-btn
                class="secondary"
                color="white darken-1"
                text
                @click="add_replay()"
              >
                اضف رد
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template>
    <v-data-table
      :headers="headers"
      :items="comments"
      :loading="table_loading || false"
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
          <v-toolbar-title>جدول التعلقات</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="commentQuery"
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
          <td class="text-start" v-if="!item.report">
            <span style="color: Red">لايوجد تبليغ</span>
          </td>
          <td class="text-start" v-else>
            <span v-if="item.report.body == null" style="color: red"
              >نص التبليغ فارغ</span
            >
            <span v-else>{{ item.report.body }}</span>
          </td>
          <td class="text-start" v-if="!item.report">
            <span style="color: Red">لايوجد تبليغ</span>
          </td>
          <td class="text-start" v-else>{{ item.report.issuer.full_name }}</td>
          <td class="text-start">{{ item.user.full_name }}</td>

          <td class="text-start">{{ item.body }}</td>
          <td class="text-start" v-if="item.parent == null">
            <span style="color: Red">لايوجد</span>
          </td>
          <td class="text-start" v-else>{{ item.parent.body }}</td>
          <td class="text-start">
            <time-ago locale="ar" :datetime="item.created_at"></time-ago>
          </td>
          <td>
            <v-col>
              <v-row class="pt-1 pb-1">
                <v-btn dark small block color="red" @click="getItem(item)"
                  >حذف
                </v-btn>
              </v-row>
              <v-row class="pb-1">
                <v-btn
                  dark
                  small
                  block
                  color="secondary"
                  @click="send_replay(item)"
                  >رد على
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
import { TimeAgo } from "vue2-timeago";

export default {
  data() {
    return {
      dialog: false,
      dialog2: false,
      headers: [
        {
          text: "التبليغ",
          value: "report_id",
          class: "secondary white--text title",
        },
        {
          text: "المبلغ",
          value: "report_id",
          class: "secondary white--text title",
        },
        {
          text: "الطالب",
          value: "user_id",
          class: "secondary white--text title",
        },

        {
          text: "نص التعليق",
          value: "body",
          class: "secondary white--text title",
        },
        {
          text: "رد على",
          value: "parent_id",
          class: "secondary white--text title",
        },
        {
          text: "الوقت",
          value: "created_at",
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
      replay: "",
    };
  },
  components: {
    TimeAgo,
  },
  computed: {
    commentQuery: {
      set(val) {
        this.$store.state.CommentModule.commentQuery = val;
      },
      get() {
        return this.$store.state.CommentModule.commentQuery;
      },
    },
    pageCount: function () {
      return this.$store.state.CommentModule.pageCount;
    },
    totalItems: function () {
      return this.$store.state.CommentModule.comments.length;
    },
    comments() {
      return this.$store.state.CommentModule.comments;
    },
    table_loading() {
      return this.$store.state.CommentModule.table_loading;
    },
    comment_params: {
      set(val) {
        this.$store.state.CommentModule.params = val;
      },
      get() {
        return this.$store.state.CommentModule.params;
      },
    },
  },
  methods: {
    reloadPage() {
      this.$store.dispatch("CommentModule/resetFields");
      this.getComments();
    },
    send_replay(item) {
      // console.log(item);
      this.replay = "";
      this.item = item;
      this.dialog2 = true;
    },
    add_replay() {
      var data = {
        parent_id: this.item.id,
        report_id: this.item.report_id,
        body: this.replay,
      };
      this.$store.dispatch("CommentModule/addComment", data);
    },
    queryChange(val) {
      this.searchDebounce();
    },
    getItem(item) {
      this.dialog = true;
      this.item = item;
    },
    deleteComment() {
      this.$store.dispatch("CommentModule/deleteComment", this.item);
      this.dialog = false;
      this.item = {};
    },
    getComments() {
      let pagination = this.pagination;
      let par = {
        ...pagination,
      };
      this.comment_params = par;
      this.$store.dispatch("CommentModule/getComments");
    },
    searchDebounce() {
      clearTimeout(this._timerId);
      // delay new call 1000ms
      this._timerId = setTimeout(() => {
        this.$store.dispatch("CommentModule/resetFields");
        this.pagination.page = 1;
        // console.log(this.commentQuery);
        this.getComments();
      }, 1000);
    },
    changeSort(column) {
      let pagination = this.comment_params;
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
      this.$store.dispatch("CommentModule/resetFields");
      this.comment_params.page = 1;
      this.comment_params.sortBy = pagination.sortBy;
      this.comment_params.sortDesc = pagination.sortDesc;
    },
  },
  created() {
    this.$store.dispatch("CommentModule/resetFields");
  },

  watch: {
    pagination: {
      handler() {
        this.getComments();
        this.comment_params.page = 1;
      },
      deep: true,
    },
  },
};
</script>
<style></style>
