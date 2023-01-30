import Vue from "vue";
import axios from "axios";

const ExamModule = {
    namespaced: true,
    state: () => ({
        exams: [],
        exam_state: "done",
        table_loading: false,
        class_id: null,
        class_name: null,
        defaultClass_id: null,
        selected_object: {},
        isEdit: false,
    }),
    getters: {},
    mutations: {

        exam_success(state, exams) {
            state.exams.splice(0, state.exams.length)
            exams.forEach(element => {
                state.exams.push(element)
            });
            state.exam_state = "done"
            state.table_loading = false
        },
        exam_request(state) {
            state.exam_state = "loading";
        },

        exam_error(state) {
            state.exam_state = "error";
        },
        add_exam_success(state, exam) {
            state.exams.push(exam);
            state.exam_state = "done";
            state.table_loading = false;
        },
        exam_edit_success(state, exam) {
            let index = state.exams.findIndex((e) => e.id == exam.id);
            Vue.set(state.exams, index, exam);
            state.exam_state = "done";
            state.table_loading = false;
        },
        delete_exam(state, exam) {
            let index = state.exams.findIndex((e) => e.id == exam.id);
            state.exams.splice(index, 1)
            state.exam_state = "done";
            state.table_loading = false;
        }




    },
    actions: {
        async getExams({ commit, state, dispatch, rootState }) {
            var filter = "";
            if (state.class_id != null) {
                filter = "?class_id=" + state.class_id;
            } else {
                filter = "?class_id=" + state.defaultClass_id;
            }
            if (state.exam_state != "done") return -1;
            state.table_loading = true;
            return new Promise((resolve, reject) => {
                axios({
                    url: `${rootState.server}` + "/api/get_exams" + filter,
                    method: "GET",
                }).then(resp => {
                    state.table_loading = false;
                    commit('exam_success', resp.data.result)
                    dispatch("snackbarToggle", { toggle: true, text: resp.data.message }, { root: true });
                    resolve(resp);
                }).catch((err) => {
                    state.table_loading = false;
                    reject(err);
                    commit("exam_error");
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: err.response.data.message },
                        { root: true }
                    );

                    console.warn(err);
                });
            })

        },

        async addExam({ commit, state, dispatch, rootState }, data) {
            state.table_loading = true
            return new Promise((resolve) => {
                commit("exam_request");
                axios({
                    url: `${rootState.server}` + "/api/add_exam",
                    data: data,
                    headers: {
                        "Content-Type": "application/json",

                    },
                    method: "POST",
                }).then(resp => {
                    state.table_loading = false;
                    commit("add_exam_success", resp.data.result[0]);
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: resp.data.message },
                        { root: true }
                    );
                    resolve(resp);
                }).catch((err) => {
                    state.table_loading = false;
                    commit("exam_error");
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: err.response.data.message },
                        { root: true }
                    );

                    console.warn(err);
                });
            });
        },
        async editExam({ commit, state, dispatch, rootState }, data) {
            state.table_loading = true
            return new Promise((resolve, reject) => {
                commit("exam_request");
                axios({
                    url: `${rootState.server}` + "/api/edit_exam",
                    data: data,
                    headers: {
                        "Content-Type": "application/json",

                    },
                    method: "PUT",
                }).then(resp => {
                    state.table_loading = false
                    commit("exam_edit_success", resp.data.result[0])
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: resp.data.message },
                        { root: true }
                    );
                    resolve(resp);
                }).catch((err) => {
                    state.table_loading = false;
                    commit("exam_error");
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: err.response.data.message },
                        { root: true }
                    );

                    console.warn(err);
                });
            });
        },

        async deleteExam({ commit, state, dispatch, rootState }, data) {
            state.table_loading = true
            return new Promise((resolve) => {
                commit("exam_request");
                axios({
                    url: `${rootState.server}` + "/api/delete_exam",
                    data: { exam_id: data.id },
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "delete",
                }).then(resp => {
                    state.table_loading = false;
                    // console.log(resp)
                    commit("delete_exam", data);
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: resp.data.message },
                        { root: true }
                    );
                    resolve(resp);
                }).catch((err) => {
                    state.table_loading = false;
                    commit("user_error");
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: err.response.data.message },
                        { root: true }
                    );

                    console.warn(err);
                });
            });
        }








    }

}
export default ExamModule;
