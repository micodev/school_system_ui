import Vue from "vue";
import axios from "axios";

const DailyMaterialModule = {
    namespaced: true,
    state: () => ({
        dailyMaterials: [],
        dailyMaterials_name: [],
        dailyMaterial_state: "done",
        table_loading: false,
        class_id: null,
        defaultClass_id: null,
        selected_object: {},
        isEdit: false,
        class_name: ""
    }),
    getters: {},
    mutations: {

        dailyMaterial_success(state, dailyMaterials) {
            state.dailyMaterials.splice(0, state.dailyMaterials.length)
            dailyMaterials.forEach(element => {
                state.dailyMaterials.push(element)
            });
            state.dailyMaterial_state = "done"
            state.table_loading = false
        },
        dailyMaterial_request(state) {
            state.dailyMaterial_state = "loading";
        },

        dailyMaterial_error(state) {
            state.dailyMaterial_state = "error";
        },
        add_dailyMaterial_success(state, dailyMaterial) {
            state.dailyMaterials.push(dailyMaterial);
            state.dailyMaterial_state = "done";
            state.table_loading = false;
        },
        get_daily_material_name(state) {
            state.dailyMaterials_name = [];
            let materials_arr = this.state.MaterialModule.materials;
            state.dailyMaterials.forEach((element) => {
                let arr = element.materials.map(function (m) {
                    return materials_arr.filter(m1 => m1.id == m)[0].name;
                })
                state.dailyMaterials_name.push(arr);
                // console.log(state.dailyMaterials_name);
            })
        },
        dailyMaterial_edit_success(state, dailyMaterial) {
            let index = state.dailyMaterials.findIndex((e) => e.id == dailyMaterial.id);
            Vue.set(state.dailyMaterials, index, dailyMaterial);
            state.dailyMaterial_state = "done";
            state.table_loading = false;
        },

    },
    actions: {
        async getDailyMaterials({ commit, state, dispatch, rootState }) {
            var filter = "";
            if (state.class_id != null) {
                filter = "?class_id=" + state.class_id;
                state.dailyMaterials_name = [];
            } else {
                filter = "?class_id=" + state.defaultClass_id;
                state.dailyMaterials_name = [];
            }
            if (state.dailyMaterial_state != "done") return -1;
            state.table_loading = true;
            return new Promise((resolve, reject) => {
                axios({
                    url: `${rootState.server}` + "/api/get_daily_materials" + filter,
                    method: "GET",
                }).then(resp => {
                    state.table_loading = false;
                    commit('dailyMaterial_success', resp.data.result)
                    dispatch("snackbarToggle", { toggle: true, text: "تم جلب الجدول الاسبوعي  بنجاح" }, { root: true });
                    commit("get_daily_material_name");
                    // console.log(resp.data.result);
                    resolve(resp);
                }).catch((err) => {
                    state.table_loading = false;
                    reject(err);
                    commit("dailyMaterial_error");
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: err.response.data.message },
                        { root: true }
                    );

                    console.warn(err);
                });
            })

        },

        async addDailyMaterial({ commit, state, dispatch, rootState }, data) {
            state.table_loading = true
            return new Promise((resolve) => {
                commit("dailyMaterial_request");
                axios({
                    url: `${rootState.server}` + "/api/add_daily_materials",
                    data: data,
                    headers: {
                        "Content-Type": "application/json",

                    },
                    method: "POST",
                }).then(resp => {
                    state.table_loading = false;
                    commit("add_dailyMaterial_success", resp.data.result[0]);
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: resp.data.message },
                        { root: true }
                    );
                    commit("get_daily_material_name");
                    resolve(resp);
                }).catch((err) => {
                    state.table_loading = false;
                    commit("dailyMaterial_error");
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: err.response.data.message },
                        { root: true }
                    );

                    console.warn(err);
                });
            });
        },
        async editDailyMaterial({ commit, state, dispatch, rootState }, data) {
            state.table_loading = true
            return new Promise((resolve, reject) => {
                commit("dailyMaterial_request");
                axios({
                    url: `${rootState.server}` + "/api/edit_daily_material",
                    data: data,
                    headers: {
                        "Content-Type": "application/json",

                    },
                    method: "PUT",
                }).then(resp => {
                    state.table_loading = false
                    commit("dailyMaterial_edit_success", resp.data.result[0])
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: resp.data.message },
                        { root: true }
                    );
                    commit("get_daily_material_name");
                    resolve(resp);
                }).catch((err) => {
                    state.table_loading = false;
                    commit("dailyMaterial_error");
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
export default DailyMaterialModule;
