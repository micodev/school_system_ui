import Vue from "vue";
import axios from "axios";

const ExamModule = {
  namespaced: true,
  state: () => ({
    reports: [],
    filter: {},
    reportQuery: "",
    pageCount: 1,
    params: {
      sortBy: [],
      sortDesc: [],
      page: 1,
      itemsPerPage: 10,
    },
    report_state: "done",
    table_loading: false,
  }),
  getters: {},
  mutations: {
    report_success(state, reports) {
      state.reports.splice(0, state.reports.length);
      reports.forEach((element) => {
        state.reports.push(element);
      });
      state.report_state = "done";
      state.table_loading = false;
    },
    report_request(state) {
      state.report_state = "loading";
    },

    report_error(state) {
      state.report_state = "error";
    },
    add_report_success(state, exam) {
      state.reports.push(exam);
      state.report_state = "done";
      state.table_loading = false;
    },

    delete_report(state, exam) {
      let index = state.reports.findIndex((e) => e.id == exam.id);
      state.reports.splice(index, 1);
      state.report_state = "done";
      state.table_loading = false;
    },
  },
  actions: {
    async resetFields({ state }) {
      state.pageCount = 1;
      state.report_state = "done";
      state.reports = [];
      state.table_loading = false;
      state.params = {
        sortBy: [],
        sortDesc: [],
        page: 1,
        itemsPerPage: 10,
      };
    },
    async getReports({ commit, state, dispatch, rootState }) {
      if (state.report_state != "done") return -1;
      state.table_loading = true;
      let data = state.params;
      return new Promise((resolve, reject) => {
        let skip = (data.page - 1) * data.itemsPerPage;
        let limit = data.itemsPerPage;
        let sort = "";
        let query = "";
        if (data.sortBy.length > 0)
          sort = `&${data.sortBy[0]}=${data.sortDesc}`;
        if (
          state.reportQuery != undefined &&
          state.reportQuery != null &&
          state.reportQuery.length > 0
        )
          query = `&query=${state.reportQuery}`;
        if (Object.keys(state.filter).length != 0) {
          if (Object.values(state.filter)[2] == "الكل") {
            var filter = "";
          } else {
            var filter = "&filter=" + JSON.stringify(state.filter);
          }
        } else {
          var filter = "";
        }
        commit("report_request");
        axios({
          url:
            `${rootState.server}` +
            "/api/get_reports" +
            "?skip=" +
            skip +
            "&limit=" +
            limit +
            sort +
            query +
            filter,
          method: "GET",
        })
          .then((resp) => {
            state.table_loading = false;
            state.pageCount = resp.data.count;

            commit("report_success", resp.data.result);
            dispatch(
              "snackbarToggle",
              { toggle: true, text: resp.data.message },
              { root: true }
            );
            resolve(resp);
          })
          .catch((err) => {
            state.table_loading = false;
            reject(err);
            commit("report_error");
            dispatch(
              "snackbarToggle",
              { toggle: true, text: err.response.data.message },
              { root: true }
            );

            console.warn(err);
          });
      });
    },

    async addReport({ commit, state, dispatch, rootState }, data) {
      state.table_loading = true;
      return new Promise((resolve) => {
        commit("report_request");
        axios({
          url: `${rootState.server}` + "/api/add_report",
          data: data,
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        })
          .then((resp) => {
            state.table_loading = false;
            commit("add_report_success", resp.data.result[0]);
            dispatch(
              "snackbarToggle",
              { toggle: true, text: resp.data.message },
              { root: true }
            );
            resolve(resp);
          })
          .catch((err) => {
            state.table_loading = false;
            commit("report_error");
            dispatch(
              "snackbarToggle",
              { toggle: true, text: err.response.data.message },
              { root: true }
            );

            console.warn(err);
          });
      });
    },

    async deleteReport({ commit, state, dispatch, rootState }, data) {
      state.table_loading = true;
      return new Promise((resolve) => {
        commit("report_request");
        console.log(`${rootState.server}` + "/api/delete_report");
        axios({
          url: `${rootState.server}` + "/api/delete_report",
          data: { report_id: data.id },
          headers: {
            "Content-Type": "application/json",
          },
          method: "delete",
        })
          .then((resp) => {
            state.table_loading = false;
            // console.log(resp)
            commit("delete_report", data);
            dispatch(
              "snackbarToggle",
              { toggle: true, text: resp.data.message },
              { root: true }
            );
            resolve(resp);
          })
          .catch((err) => {
            state.table_loading = false;
            console.log(err);
            commit("report_error");
            dispatch(
              "snackbarToggle",
              { toggle: true, text: "حدث خطأ" },
              { root: true }
            );

            console.warn(err);
          });
      });
    },
  },
};
export default ExamModule;
