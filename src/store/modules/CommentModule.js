import Vue from "vue";
import axios from "axios";

const CommentModule = {
    namespaced: true,
    state: () => ({
        comments: [],
        comment_state: "done",
        table_loading: false,
        pageCount: 1,
        commentQuery: "",
        params: {
            sortBy: [],
            sortDesc: [],
            page: 1,
            itemsPerPage: 3,
        },


    }),
    getters: {},
    mutations: {

        comment_success(state, comments) {
            state.comments.splice(0, state.comments.length)
            comments.forEach(element => {
                state.comments.push(element)
            });
            state.comment_state = "done"
            state.table_loading = false
        },
        comment_request(state) {
            state.comment_state = "loading";
        },

        comment_error(state) {
            state.comment_state = "error";
        },
        delete_comment(state, comment) {
            let index = state.comments.findIndex((e) => e.id == comment.id);
            state.comments.splice(index, 1)
            state.comment_state = "done";
            state.table_loading = false;
        },
        add_comment_success(state, comment) {
            state.comments.push(comment);
            state.comment_state = "done";
            state.table_loading = false;
        },




    },
    actions: {
        async resetFields({ state }) {
            state.pageCount = 1;
            state.comment_state = "done";
            state.comments = [];
            state.table_loading = false;
            state.params = {
                sortBy: [],
                sortDesc: [],
                page: 1,
                itemsPerPage: 10,
            };
        },
        async getComments({ commit, state, dispatch, rootState }) {

            if (state.comment_state != "done") return -1;
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
                    state.commentQuery != undefined &&
                    state.commentQuery != null &&
                    state.commentQuery.length > 0
                ) query = `&query=${state.commentQuery}`;
                commit("comment_request");
                axios({
                    url: `${rootState.server}` + "/api/get_comments" +
                        "?skip=" + skip +
                        "&limit=" +
                        limit +
                        sort +
                        query,
                    method: "GET",
                }).then(resp => {
                    state.table_loading = false;
                    state.pageCount = resp.data.count;

                    commit('comment_success', resp.data.result)
                    dispatch("snackbarToggle", { toggle: true, text: "تم جلب التعليقات بنجاح" }, { root: true });
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
        async addComment({ commit, state, dispatch, rootState }, data) {
            state.table_loading = true
            return new Promise((resolve) => {
                commit("comment_request");
                axios({
                    url: `${rootState.server}` + "/api/add_comment",
                    data: data,
                    headers: {
                        "Content-Type": "application/json",

                    },
                    method: "POST",
                }).then(resp => {
                    state.table_loading = false;
                    commit("add_comment_success", resp.data.result[0]);
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
                commit("comment_request");
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
export default CommentModule;
