// import Vue from "vue";
import axios from "axios";

const SchoolModule = {
    namespaced: true,
    state: () => ({
        schools: [],
        school_state: "done",
        table_loading: false,
    }),
    getters: {},
    mutations: {
        school_success(state, schools) {
            state.schools.splice(0, state.schools.length)
            schools.forEach(element => {
                state.schools.push(element)
            });
            state.school_state = "done"
            state.table_loading = false
        },
        school_request(state) {
            state.school_state = "loading";
        },

        school_error(state) {
            state.school_state = "error";
        },
        add_school_success(state, school) {
            state.schools.push(school);
            state.school_state = "done";
            state.table_loading = false;
        }


    },
    actions: {
        async getSchools({ commit, state, dispatch, rootState }) {
            if (state.school_state != "done") return -1;
            state.table_loading = true;
            return new Promise((resolve, reject) => {

                axios({
                    url: `${rootState.server}` + "/api/get_schools",
                    method: "GET",
                }).then(resp => {
                    state.table_loading = false;
                    commit('school_success', resp.data.result)
                    dispatch("snackbarToggle", { toggle: true, text: resp.data.message }, { root: true });
                    resolve(resp);
                }).catch((err) => {
                    state.table_loading = false;
                    reject(err);
                    commit("school_error");
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: err.response.data.message },
                        { root: true }
                    );

                    console.warn(err);
                });
            })

        },

        async addSchool({ commit, state, dispatch, rootState }, data) {
            state.table_loading = true
            return new Promise((resolve) => {
                commit("school_request");
                axios({
                    url: `${rootState.server}` + "/api/add_school",
                    data: data,
                    headers: {
                        "Content-Type": "application/json",

                    },
                    method: "POST",
                }).then(resp => {
                    state.table_loading = false;
                    commit("add_school_success", resp.data.result[0]);
                    console.log(resp)
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: resp.data.message },
                        { root: true }
                    );
                    resolve(resp);
                }).catch((err) => {
                    state.table_loading = false;
                    commit("school_error");
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
export default SchoolModule;
