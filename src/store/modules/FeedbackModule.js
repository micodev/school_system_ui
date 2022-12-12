// import Vue from "vue";
import axios from "axios";

const FeedbackModule = {
    namespaced: true,
    state: () => ({
        feedbacks: [],
        feedback_state: "done",
        table_loading: false,
        feedbackQuery: "",
        pageCount: 1,
        params: {
            sortBy: [],
            sortDesc: [],
            page: 1,
            itemsPerPage: 10,
        },
    }),
    getters: {},
    mutations: {
        feedback_success(state, feedbacks) {
            state.feedbacks.splice(0, state.feedbacks.length)
            feedbacks.forEach(element => {
                state.feedbacks.push(element)
            });
            state.feedback_state = "done"
            state.table_loading = false
        },
        feedback_request(state) {
            state.feedback_state = "loading";
        },

        feedback_error(state) {
            state.feedback_state = "error";
        },



    },
    actions: {
        async resetFields({ state }) {
            state.pageCount = 1;
            state.feedback_state = "done";
            state.feedbacks = [];
            state.table_loading = false;
            state.params = {
                sortBy: [],
                sortDesc: [],
                page: 1,
                itemsPerPage: 10,
            };
        },
        async getFeedbacks({ commit, state, dispatch, rootState }) {
            if (state.feedback_state != "done") return -1;
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
                    state.feedbackQuery != undefined &&
                    state.feedbackQuery != null &&
                    state.feedbackQuery.length > 0
                ) query = `&query=${state.feedbackQuery}`;
                commit("feedback_request");

                axios({
                    url: `${rootState.server}` + "/api/get_feedbacks" +
                        "?skip=" + skip +
                        "&limit=" +
                        limit +
                        sort +
                        query,
                    method: "GET",
                }).then(resp => {
                    state.table_loading = false;
                    state.pageCount = resp.data.count;

                    commit('feedback_success', resp.data.result)
                    dispatch("snackbarToggle", { toggle: true, text: resp.data.message }, { root: true });
                    resolve(resp);
                }).catch((err) => {
                    state.table_loading = false;
                    reject(err);
                    commit("feedback_error");
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: err.response.data.message },
                        { root: true }
                    );

                    console.warn(err);
                });
            })

        },
    }

}
export default FeedbackModule;
