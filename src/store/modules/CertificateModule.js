import Vue from "vue";
import axios from "axios";

const CertificateModule = {
    namespaced: true,
    state: () => ({
        certificate: [],
        local_certificate: [],
        certificate_state: "done",
        table_loading: false,
        pageCount: 1,
        user_id: null,
        class_id: null,
        defaultClass_id: null,
    }),
    getters: {},
    mutations: {

        certificate_success(state, certificate) {
            // console.log(certificate)
            state.certificate.splice(0, state.certificate.length)
            certificate.forEach(element => {
                state.certificate.push(element)
            });
            state.certificate_state = "done"
            state.table_loading = false
        },
        certificate_request(state) {
            state.certificate_state = "loading";
        },

        comment_error(state) {
            state.certificate_state = "error";
        },

        add_certificate_success(state, comment) {
            // state.certificate.push(comment);
            state.certificate_state = "done";
            state.table_loading = false;
        },




    },
    actions: {
        async resetFields({ state }) {
            state.pageCount = 1;
            state.certificate_state = "done";
            state.certificate = [];
            state.local_certificate = [];
            state.table_loading = false;

            state.defaultClass_id = null
            state.user_id = null
            state.class_id = null

            state.params = {
                sortBy: [],
                sortDesc: [],
                page: 1,
                itemsPerPage: 10,
            };
        },
        async getCertificate({ commit, state, dispatch, rootState }) {

            if (state.certificate_state != "done") return -1;
            state.table_loading = true;
            let data = state.params;
            var filter = "?filter=" + JSON.stringify({ name: "user_id", value: [state.user_id] });

            // console.log(filter);
            return new Promise((resolve, reject) => {
                axios({
                    url: `${rootState.server}` + "/api/get_degrees" + filter,
                    method: "GET",
                }).then(resp => {
                    state.table_loading = false;
                    state.pageCount = resp.data.count;

                    commit('certificate_success', resp.data.result)
                    dispatch("snackbarToggle", { toggle: true, text: resp.data.message }, { root: true });
                    resolve(resp);
                }).catch((err) => {
                    state.table_loading = false;
                    reject(err);
                    commit("comment_error");
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: err.response.data.message },
                        { root: true }
                    );

                    console.warn(err);
                });
            })

        },
        async addCertificate({ commit, state, dispatch, rootState }, data) {
            state.table_loading = true
            return new Promise((resolve) => {
                commit("certificate_request");
                axios({
                    url: `${rootState.server}` + "/api/add_degree",
                    data: data,
                    headers: {
                        "Content-Type": "application/json",

                    },
                    method: "POST",
                }).then(resp => {
                    state.table_loading = false;
                    commit("add_certificate_success", resp.data.result[0]);
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: resp.data.message },
                        { root: true }
                    );
                    resolve(resp);
                }).catch((err) => {
                    state.table_loading = false;
                    commit("comment_error");

                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: err.response.data.message },
                        { root: true }
                    );

                    console.warn(err);
                });
            });
        },

        async deleteComment({ commit, state, dispatch, rootState }, data) {
            state.table_loading = true
            return new Promise((resolve) => {
                commit("certificate_request");
                axios({
                    url: `${rootState.server}` + "/api/delete_comment",
                    data: { comment_id: data.id },
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "delete",
                }).then(resp => {
                    state.table_loading = false;
                    // console.log(resp)
                    commit("delete_comment", data);
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: resp.data.message },
                        { root: true }
                    );
                    resolve(resp);
                }).catch((err) => {
                    state.table_loading = false;
                    commit("comment_error");
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
export default CertificateModule;
