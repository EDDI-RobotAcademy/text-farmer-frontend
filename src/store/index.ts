import { createStore } from "vuex";
import accountModule from "@/account/store/accountModule";
import authenticationModule from "@/authentication/store/authenticationModule";

export default createStore({
    state: {},
    getters: {},
    mutations: {},
    actions: {},
    modules: {
        accountModule,
        authenticationModule,
    },
});
