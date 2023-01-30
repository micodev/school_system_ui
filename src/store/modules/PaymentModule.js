// import Vue from "vue";
import axios from "axios";

const PaymentModule = {
    namespaced: true,
    state: () => ({
        payments: [],
        payment_state: "done",
        table_loading: false,
        paymentQuery: "",
        pageCount: 1,
        params: {
            dropdown: true,
            sortBy: [],
            sortDesc: [],
            page: 1,
            itemsPerPage: 10,
        },
    }),
    getters: {},
    mutations: {
        payment_success(state, payments) {
            state.payments.splice(0, state.payments.length)
            payments.forEach(element => {
                state.payments.push(element)
            });
            state.payment_state = "done"
            state.table_loading = false
        },
        payment_request(state) {
            state.payment_state = "loading";
        },

        payment_error(state) {
            state.payment_state = "error";
        },
        add_payment_success(state, payment) {
            state.payments.push(payment);
            state.payment_state = "done";
            state.table_loading = false;
        },


    },
    actions: {
        async resetFields({ state }) {
            // console.log("reset fields deliveries");
            state.pageCount = 1;
            state.payment_state = "done";
            state.payments = [];
            state.table_loading = false;
            state.params = {
                dropdown: true,
                sortBy: [],
                sortDesc: [],
                page: 1,
                itemsPerPage: 10,

            };
        },
        async getPayments({ commit, state, dispatch, rootState }) {
            if (state.payment_state != "done") return -1;
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
                    state.paymentQuery != undefined &&
                    state.paymentQuery != null &&
                    state.paymentQuery.length > 0
                ) query = `&query=${state.paymentQuery}`;
                commit("payment_request");
                axios({
                    url: `${rootState.server}` + "/api/get_payments" +
                        "?skip=" +
                        skip +
                        "&limit=" +
                        limit +
                        sort +
                        query,
                    method: "GET",
                }).then(resp => {
                    state.table_loading = false;
                    state.pageCount = resp.data.count;
                    commit('payment_success', resp.data.result)
                    dispatch("snackbarToggle", { toggle: true, text: resp.data.message }, { root: true });
                    resolve(resp);
                }).catch((err) => {
                    state.table_loading = false;
                    reject(err);
                    commit("payment_error");
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: err.response.data.message },
                        { root: true }
                    );

                    console.warn(err);
                });
            })

        },

        async addPayment({ commit, state, dispatch, rootState }, data) {
            state.table_loading = true
            return new Promise((resolve) => {
                commit("payment_request");
                axios({
                    url: `${rootState.server}` + "/api/add_payment",
                    data: data,
                    headers: {
                        "Content-Type": "application/json",

                    },
                    method: "POST",
                }).then(resp => {
                    state.table_loading = false;
                    commit("add_payment_success", resp.data.result[0]);
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: resp.data.message },
                        { root: true }
                    );
                    resolve(resp);
                }).catch((err) => {
                    state.table_loading = false;
                    commit("payment_error");
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
export default PaymentModule;
