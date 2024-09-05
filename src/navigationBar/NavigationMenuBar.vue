<template>
    <v-app-bar v-if="hideMenuBar" color="black" app dark height="40">
        <v-btn @click="goToHome">
            <v-toolbar-title class="top-bar-text-title">T–F</v-toolbar-title>
        </v-btn>
        <v-spacer></v-spacer>

        <v-btn v-if="!isAuthenticated" text @click="signIn">
            <v-icon left>mdi-login</v-icon>
            <span>LOGIN</span>
        </v-btn>
        <v-btn v-else text @click="signOut">
            <v-icon left>mdi-logout</v-icon>
            <span>LOGOUT</span>
        </v-btn>
    </v-app-bar>
</template>

<script>
import router from "@/router";
import { mapActions, mapState } from "vuex";

const accountModule = "accountModule";
const authenticationModule = "authenticationModule";

export default {
    data() {
        return {
            myPageItems: [
                {
                    title: "LOGOUT",
                    action: () => {
                        this.signOut();
                    },
                },
            ],
            isUserAuthenticated: localStorage.getItem("isUserAuthenticated"),
        };
    },

    computed: {
        hideMenuBar() {
            const hiddenRoutes = ["/", "/account/login", "/chatting-room"];

            return !hiddenRoutes.includes(this.$route.path);
        },
        ...mapState(authenticationModule, ["isAuthenticated"]),
    },

    methods: {
        ...mapActions(authenticationModule, ["requestLogoutToDjango"]),

        goToHome() {
            router.push("/");
        },
        signIn() {
            router.push("/account/login");
        },
        signOut() {
            this.requestLogoutToDjango();
            router.push("/");
        },
    },

    mounted() {
        const userToken = localStorage.getItem("userToken");
        if (userToken) {
            console.log("You already has a userToken!");
            this.$store.state.authenticationModule.isAuthenticated = true;
        }
    },

    beforeUnmount() {
        window.removeEventListener("storage", this.updateLoginStatus);
    },
};
</script>

<style scoped>
.top-bar-text-title {
    font-size: 24px;
}

.v-btn:hover {
    background-color: rgb(80, 80, 80);
}
</style>
