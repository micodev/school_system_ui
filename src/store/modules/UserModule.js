import Vue from "vue";
import axios from "axios";

const UserModule = {
    namespaced: true,
    state: () => ({

        users: [],
        userQuery: "",
        teacherQuery: "",
        teacher_state: "done",

        pageCount: 1,
        params: {
            dropdown: true,
            sortBy: [],
            sortDesc: [],
            page: 1,
            itemsPerPage: 3,
        },
        infoUser: "",
        teachers: [],
        user_state: "done",
        table_loading: false,
        filter: {},
        active_side_bar: false,
    }),
    getters: {},
    mutations: {
        user_success(state, users) {
            state.users.splice(0, state.users.length)
            users.forEach(element => {
                state.users.push(element)
            });
            state.user_state = "done"
            state.table_loading = false
        },
        teacher_success(state, teachers) {
            state.teachers.splice(0, state.teachers.length)
            teachers.forEach(element => {
                state.teachers.push(element)
            });
            state.teacher_state = "done"
            state.table_loading = false
        },
        add_user_success(state, user) {
            if (user.user_type == 2) {
                state.teachers.push(user)
            } else if (user.user_type == 3) {
                state.users.push(user);
            }
            state.user_state = "done";
            state.table_loading = false;
        },
        user_request(state) {
            state.user_state = "loading";
        },
        teacher_request(state) {
            state.teacher_state = "loading";
        },

        user_error(state) {
            state.user_state = "error";
        },
        delete_user(state, user) {

            // console.log(user);
            if (user.user_type == 2) {
                let index = state.teachers.findIndex((e) => e.id == user.id);
                state.teachers.splice(index, 1)
            } else if (user.user_type == 3) {
                let index = state.users.findIndex((e) => e.id == user.id);
                state.users.splice(index, 1)
            }

            // let index = state.users.findIndex((e) => e.id == user.user_id);
            // state.users.splice(index, 1)

            state.user_state = "done";
            state.table_loading = false;
        },

        users_dropdown_success(state, users) {

            state.table_loading = false;
            if (users.length == 0) {
                state.user_state = "finished";
                if (state.params.page > 1)
                    state.params.page = state.params.page - 1;
                return;
            }
            state.params.page = state.params.page + 1;
            users.forEach((user) => {
                state.users.push(user);
            });
            state.user_state = "done";
        },
        teacher_dropdown_success(state, teachers) {

            state.table_loading = false;
            if (teachers.length == 0) {
                state.teacher_state = "finished";
                if (state.params.page > 1)
                    state.params.page = state.params.page - 1;
                return;
            }
            state.params.page = state.params.page + 1;
            teachers.forEach((teacher) => {
                state.teachers.push(teacher);
            });
            state.teacher_state = "done";
        },
        show_info(state, data) {
            state.infoUser = data.password
        },

        hide_degree(state, user) {
            // console.log(user);
            let index = state.users.findIndex((e) => e.id == user.id);
            Vue.set(state.users, index, user);
            state.user_state = "done";
            state.table_loading = false;
        }


    },
    actions: {

        async resetFields({ state }) {
            // console.log("reset fields deliveries");
            state.pageCount = 1;
            state.user_state = "done";
            state.teacher_state = "done";
            state.users = [];
            state.teacher = [];
            // state.userQuery = "";
            state.teacher_state = "done";
            // state.teacherQuery = "";
            state.table_loading = false;
            state.params = {
                dropdown: true,
                sortBy: [],
                sortDesc: [],
                page: 1,
                itemsPerPage: 3,
            };
        },
        async getUsers({ commit, state, dispatch, rootState }) {
            if (state.user_state != "done") return -1;
            state.table_loading = true;
            let data = state.params;
            // console.log(data);
            var filterUser = "";
            if (Object.keys(state.filter).length != 0)
                var filterUser = "&filter=" + JSON.stringify(state.filter);
            // console.log(filterUser);

            return new Promise((resolve, reject) => {
                let skip = (data.page - 1) * data.itemsPerPage;
                let limit = data.itemsPerPage;
                let sort = "";
                let query = "";
                if (data.sortBy.length > 0)
                    sort = `&${data.sortBy[0]}=${data.sortDesc}`;
                if (
                    state.userQuery != undefined &&
                    state.userQuery != null &&
                    state.userQuery.length > 0
                ) query = `&query=${state.userQuery}`;
                commit("user_request");
                axios({
                    url: `${rootState.server}` + "/api/get_users?user_type=3" + filterUser + "&skip=" + skip +
                        "&limit=" +
                        limit +
                        sort +
                        query,
                    method: "GET",
                }).then(resp => {
                    state.table_loading = false;
                    state.pageCount = resp.data.count;
                    if (data.dropdown == false) {
                        commit('user_success', resp.data.result)
                        dispatch("snackbarToggle", { toggle: true, text: resp.data.message }, { root: true });
                    } else {
                        commit("users_dropdown_success", resp.data.result);
                    }

                    resolve(resp);
                }).catch((err) => {
                    state.table_loading = false;
                    reject(err);
                    commit("user_error");
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: err.response.data.message },
                        { root: true }
                    );

                    console.warn(err);
                });

            })

        },
        async getTeachers({ commit, state, dispatch, rootState }) {
            if (state.teacher_state != "done") return -1;
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
                    state.teacherQuery != undefined &&
                    state.teacherQuery != null &&
                    state.teacherQuery.length > 0
                ) query = `&query=${state.teacherQuery}`;
                commit("teacher_request");
                axios({
                    url: `${rootState.server}` + "/api/get_users?user_type=2" +
                        "&skip=" +
                        skip +
                        "&limit=" +
                        limit +
                        sort +
                        query,
                    method: "GET",
                }).then(resp => {
                    state.table_loading = false;
                    state.pageCount = resp.data.count;
                    if (data.dropdown == false) {
                        commit('teacher_success', resp.data.result)
                        dispatch("snackbarToggle", { toggle: true, text: "تم جلب المدرسين بنجاح" }, { root: true });
                        resolve(resp);
                    } else {
                        commit("teacher_dropdown_success", resp.data.result);
                    }
                }).catch((err) => {
                    state.table_loading = false;
                    reject(err);
                    commit("user_error");
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: err.response.data.message },
                        { root: true }
                    );
                    console.warn(err);
                });
            })

        },
        async addUser({ commit, state, dispatch, rootState }, data) {
            state.table_loading = true
            return new Promise((resolve) => {
                commit("user_request");
                axios({
                    url: `${rootState.server}` + "/api/add_user",
                    data: data,
                    headers: {
                        "Content-Type": "application/json",

                    },
                    method: "POST",
                }).then(resp => {
                    state.table_loading = false;
                    commit("add_user_success", resp.data.result[0]);
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
        },
        async deleteUser({ commit, state, dispatch, rootState }, data) {
            state.table_loading = true
            return new Promise((resolve) => {
                commit("user_request");
                axios({
                    url: `${rootState.server}` + "/api/delete_user",
                    data: { user_id: data.id },
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "delete",
                }).then(resp => {
                    state.table_loading = false;
                    // console.log(resp)
                    commit("delete_user", data);
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
        },

        async getUserInfo({ commit, state, rootState }, data) {
            return new Promise((resolve, reject) => {
                axios({
                    url: `${rootState.server}` + "/api/show_pass",
                    data: { user_id: data },
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "POST",
                }).then(resp => {
                    commit("show_info", resp.data.result[0])
                    resolve(resp);
                }).catch((err) => {
                    reject(err);
                    commit("user_error");
                    console.warn(err);
                });

            })
        },

        async hideDegree({ commit, rootState, state, dispatch }, data) {
            state.table_loading = true
            return new Promise((resolve) => {
                commit("user_request");
                axios({
                    url: `${rootState.server}` + "/api/hide_degree",
                    data: { user_id: data.id },
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "PUT",
                }).then(response => {
                    state.table_loading = false;
                    commit("hide_degree", response.data.result[0]);

                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: "تم تغير حالة الشهادة المستخدم بنجاح" },
                        { root: true }
                    );
                    resolve(response);
                }).catch((err) => {
                    // console.log(err)
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
export default UserModule;
