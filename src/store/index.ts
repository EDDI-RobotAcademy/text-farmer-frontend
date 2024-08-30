import { createStore } from "vuex";
import accountModule from "@/account/store/accountModule";
import authenticationModule from "@/authentication/store/authenticationModule";
import aiCommandModule from "@/gatherEverything/store/gatherEverthingModule";

export default createStore({
    state: {},
    getters: {},
    mutations: {},
    actions: {},
    modules: {
        accountModule,
        authenticationModule,
        aiCommandModule,
    },
});
