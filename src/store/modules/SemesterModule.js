// import Vue from "vue";
import axios from "axios";

const SemesterModule = {
    namespaced: true,
    state: () => ({
        semesters: [],
        semester_state: "done",
        table_loading: false,
        semesterQuery: "",
        pageCount: 1,
        params: {
            dropdown: true,
            sortBy: [],
            sortDesc: [],
            page: 1,
            itemsPerPage: 10,
        },
        filter: {}
    }),
    getters: {},
    mutations: {
        semester_success(state, semesters) {
            state.semesters.splice(0, state.semesters.length)
            semesters.forEach(element => {
                state.semesters.push(element)
            });
            state.semester_state = "done"
            state.table_loading = false
        },
        semester_request(state) {
            state.semester_state = "loading";
        },

        semester_error(state) {
            state.semester_state = "error";
        },
        add_semester_success(state, semester) {
            state.semesters.unshift(semester);
            state.semester_state = "done";
            state.table_loading = false;
        }


    },
    actions: {
        async resetFields({ state }) {
            state.pageCount = 1;
            state.semester_state = "done";
            state.semesters = [];
            state.table_loading = false;
            state.filter = {}
            state.params = {
                dropdown: true,
                sortBy: [],
                sortDesc: [],
                page: 1,
                itemsPerPage: 10,

            };
        },
        async getSemesters({ commit, state, dispatch, rootState }) {
            if (state.semester_state != "done") return -1;
            var filterSemester = "";
            if (Object.keys(state.filter).length != 0)
                filterSemester = "&filter=" + JSON.stringify(state.filter);
            // console.log(filterSemester);

            let data = state.params;
            state.table_loading = true;
            return new Promise((resolve, reject) => {
                let skip = (data.page - 1) * data.itemsPerPage;
                let limit = data.itemsPerPage;
                let sort = "";
                let query = "";
                if (data.sortBy.length > 0)
                    sort = `&${data.sortBy[0]}=${data.sortDesc}`;
                if (
                    state.semesterQuery != undefined &&
                    state.semesterQuery != null &&
                    state.semesterQuery.length > 0
                ) query = `&query=${state.semesterQuery}`;
                commit("semester_request");
                axios({
                    url: `${rootState.server}` + "/api/get_semesters" + "?skip=" +
                        skip +
                        "&limit=" +
                        limit +
                        sort +
                        query + filterSemester,
                    method: "GET",
                }).then(resp => {
                    state.table_loading = false;
                    state.pageCount = resp.data.count;

                    commit('semester_success', resp.data.result)
                    dispatch("snackbarToggle", { toggle: true, text: resp.data.message }, { root: true });
                    resolve(resp);
                }).catch((err) => {
                    state.table_loading = false;
                    reject(err);
                    commit("semester_error");
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: err.response.data.message },
                        { root: true }
                    );

                    console.warn(err);
                });
            })

        },

        async addSemester({ commit, state, dispatch, rootState }, data) {
            state.table_loading = true
            return new Promise((resolve) => {
                commit("semester_request");
                axios({
                    url: `${rootState.server}` + "/api/add_semester",
                    data: data,
                    headers: {
                        "Content-Type": "application/json",

                    },
                    method: "POST",
                }).then(resp => {
                    state.table_loading = false;
                    commit("add_semester_success", resp.data.result[0]);
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: resp.data.message },
                        { root: true }
                    );
                    resolve(resp);
                }).catch((err) => {
                    state.table_loading = false;
                    commit("semester_error");
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: err.response.data.message },
                        { root: true }
                    );

                    console.warn(err);
                });
            });
        },




    }

}
export default SemesterModule;
