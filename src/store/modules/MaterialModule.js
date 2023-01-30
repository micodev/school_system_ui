// import Vue from "vue";
import axios from "axios";

const MaterialModule = {
    namespaced: true,
    state: () => ({
        materials: [],
        material_state: "done",
        table_loading: false,
        filter: {}
    }),
    getters: {},
    mutations: {
        material_success(state, materials) {
            state.materials.splice(0, state.materials.length)
            materials.forEach(element => {
                state.materials.push(element)
            });
            state.material_state = "done"
            state.table_loading = false
        },
        material_request(state) {
            state.material_state = "loading";
        },

        material_error(state) {
            state.material_state = "error";
        },
        add_material_success(state, material) {
            state.materials.push(material);
            state.material_state = "done";
            state.table_loading = false;
        },
        delete_material(state, material) {

            let index = state.materials.findIndex((e) => e.id == material.id);
            state.materials.splice(index, 1)
            state.material_state = "done";
            state.table_loading = false;
        }

    },
    actions: {
        async resetFields({ state }) {

            state.material_state = "done";
            state.materials = [];
            state.table_loading = false;
            state.filter = {}

        },
        async getMaterials({ commit, state, dispatch, rootState }) {
            if (state.material_state != "done") return -1;
            state.table_loading = true;
            var filterMaterial = "";
            if (Object.keys(state.filter).length != 0)
                filterMaterial = "?filter=" + JSON.stringify(state.filter);
            // console.log(filterMaterial);
            return new Promise((resolve, reject) => {

                axios({
                    url: `${rootState.server}` + "/api/get_materials" + filterMaterial,
                    method: "GET",
                }).then(resp => {
                    state.table_loading = false;
                    commit('material_success', resp.data.result)
                    dispatch("snackbarToggle", { toggle: true, text: resp.data.message }, { root: true });
                    resolve(resp);
                }).catch((err) => {
                    state.table_loading = false;
                    reject(err);
                    commit("material_error");
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: err.response.data.message },
                        { root: true }
                    );

                    console.warn(err);
                });
            })

        },

        async addMaterial({ commit, state, dispatch, rootState }, data) {
            state.table_loading = true
            return new Promise((resolve) => {
                commit("material_request");
                axios({
                    url: `${rootState.server}` + "/api/add_material",
                    data: data,
                    headers: {
                        "Content-Type": "application/json",

                    },
                    method: "POST",
                }).then(resp => {
                    state.table_loading = false;
                    commit("add_material_success", resp.data.result[0]);
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: resp.data.message },
                        { root: true }
                    );
                    resolve(resp);
                }).catch((err) => {
                    state.table_loading = false;
                    commit("material_error");
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: err.response.data.message },
                        { root: true }
                    );

                    console.warn(err);
                });
            });
        },
        async deleteMaterial({ commit, state, dispatch, rootState }, data) {
            state.table_loading = true
            return new Promise((resolve) => {
                commit("user_request");
                axios({
                    url: `${rootState.server}` + "/api/delete_material",
                    data: { material_id: data.id },
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "delete",
                }).then(resp => {
                    state.table_loading = false;
                    // console.log(resp)
                    commit("delete_material", data);
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: resp.data.message },
                        { root: true }
                    );
                    resolve(resp);
                }).catch((err) => {
                    state.table_loading = false;
                    commit("material_error");
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
export default MaterialModule;
