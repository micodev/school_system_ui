// import Vue from "vue";
import axios from "axios";

const StageModule = {
    namespaced: true,
    state: () => ({
        stages: [],
        stage_state: "done",
        table_loading: false,
        school_id: "",

    }),
    getters: {},
    mutations: {
        stage_success(state, stages) {
            state.stages.splice(0, state.stages.length)
            stages.forEach(element => {
                state.stages.push(element)
            });
            state.stage_state = "done"
            state.table_loading = false
        },
        stage_request(state) {
            state.stage_state = "loading";
        },

        stage_error(state) {
            state.stage_state = "error";
        },
        add_stage_success(state, stage) {
            state.stages.unshift(stage);
            state.stage_state = "done";
            state.table_loading = false;
        }


    },
    actions: {
        async resetFields({ state }) {
            state.stage_state = "done";
            state.stages = [];
            state.table_loading = false;
        },
        async getStages({ commit, state, dispatch, rootState }) {
            if (state.stage_state != "done") return -1;
            state.table_loading = true;
            var school_id = "";
            if (state.school_id != undefined && state.school_id.length != null && state.school_id > 0) {
                school_id = "?school_id=" + state.school_id
            } else {
                school_id = ""
            }

            // console.log(school_id)
            return new Promise((resolve, reject) => {

                axios({
                    url: `${rootState.server}` + "/api/get_stages" + school_id,
                    method: "GET",
                }).then(resp => {
                    state.table_loading = false;
                    commit('stage_success', resp.data.result)
                    dispatch("snackbarToggle", { toggle: true, text: resp.data.message }, { root: true });
                    resolve(resp);
                }).catch((err) => {
                    state.table_loading = false;
                    reject(err);
                    commit("stage_error");
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: err.response.data.message },
                        { root: true }
                    );

                    console.warn(err);
                });
            })

        },

        async addStage({ commit, state, dispatch, rootState }, data) {
            state.table_loading = true
            return new Promise((resolve) => {
                commit("stage_request");
                axios({
                    url: `${rootState.server}` + "/api/add_stage",
                    data: data,
                    headers: {
                        "Content-Type": "application/json",

                    },
                    method: "POST",
                }).then(resp => {
                    state.table_loading = false;
                    commit("add_stage_success", resp.data.result[0]);
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: resp.data.message },
                        { root: true }
                    );
                    resolve(resp);
                }).catch((err) => {
                    state.table_loading = false;
                    commit("stage_error");
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
export default StageModule;
