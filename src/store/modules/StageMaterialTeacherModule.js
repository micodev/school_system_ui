import Vue from "vue";
import axios from "axios";

const StageMaterialTeacherModule = {
    namespaced: true,
    state: () => ({
        SMTs: [],

        SMTQuery: "",
        pageCount: 1,
        params: {
            sortBy: [],
            sortDesc: [],
            page: 1,
            itemsPerPage: 10,
        },
        smt_state: "done",
        table_loading: false,
    }),
    getters: {},
    mutations: {

        smt_success(state, SMTs) {
            state.SMTs.splice(0, state.SMTs.length)
            SMTs.forEach(element => {
                state.SMTs.push(element)
            });
            state.smt_state = "done"
            state.table_loading = false
        },
        smt_request(state) {
            state.smt_state = "loading";
        },

        smt_error(state) {
            state.smt_state = "error";
        },
        add_smt_success(state, smt) {
            state.SMTs.push(smt);
            state.smt_state = "done";
            state.table_loading = false;
        },

        delete_smt(state, smt) {
            let index = state.SMTs.findIndex((e) => e.id == smt.id);
            state.SMTs.splice(index, 1)
            state.smt_state = "done";
            state.table_loading = false;
        }
    },
    actions: {
        async resetFields({ state }) {
            state.pageCount = 1;
            state.smt_state = "done";
            state.SMTs = [];
            state.table_loading = false;
            state.params = {
                sortBy: [],
                sortDesc: [],
                page: 1,
                itemsPerPage: 10,
            };
        },
        async getSMTs({ commit, state, dispatch, rootState }) {

            if (state.smt_state != "done") return -1;
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
                    state.SMTQuery != undefined &&
                    state.SMTQuery != null &&
                    state.SMTQuery.length > 0
                ) query = `&query=${state.SMTQuery}`;
                commit("smt_request");
                axios({
                    url: `${rootState.server}` + "/api/get_material_stage_teacher" +
                        "?skip=" + skip +
                        "&limit=" +
                        limit +
                        query,
                    method: "GET",
                }).then(resp => {
                    state.table_loading = false;
                    state.pageCount = resp.data.count;
                    commit('smt_success', resp.data.result)
                    dispatch("snackbarToggle", { toggle: true, text: resp.data.message }, { root: true });
                    resolve(resp);
                }).catch((err) => {
                    state.table_loading = false;
                    reject(err);
                    commit("smt_error");
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: err.response.data.message },
                        { root: true }
                    );

                    console.warn(err);
                });
            })

        },
        async addSMT({ commit, state, dispatch, rootState }, data) {
            state.table_loading = true
            return new Promise((resolve) => {
                commit("smt_request");
                axios({
                    url: `${rootState.server}` + "/api/add_material_stage_teacher",
                    data: data,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "POST",
                }).then(resp => {
                    state.table_loading = false;
                    commit("add_smt_success", resp.data.result[0]);
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: resp.data.message },
                        { root: true }
                    );
                    resolve(resp);
                }).catch((err) => {
                    state.table_loading = false;
                    commit("smt_error");
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: err.response.data.message },
                        { root: true }
                    );

                    console.warn(err);
                });
            });
        },
        async deleteSMT({ commit, state, dispatch, rootState }, data) {
            state.table_loading = true
            return new Promise((resolve) => {
                commit("smt_request");
                axios({
                    url: `${rootState.server}` + "/api/delete_material_stage_teacher",
                    data: { id: data.id },
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "delete",
                }).then(resp => {
                    state.table_loading = false;
                    // console.log(resp)
                    commit("delete_smt", data);
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: resp.data.message },
                        { root: true }
                    );
                    resolve(resp);
                }).catch((err) => {
                    state.table_loading = false;
                    commit("smt_error");
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
export default StageMaterialTeacherModule;
