<template>
    <div></div>
</template>

<script>
import { mapActions } from "vuex";

const authenticationModule = "authenticationModule";
const accountModule = "accountModule";

export default {
    methods: {
        ...mapActions(authenticationModule, [
            "requestAccessTokenToDjangoRedirection",
            "requestUserInfoToDjango",
            "requestAddRedisAccessTokenToDjango",
        ]),
        ...mapActions(accountModule, ["requestEmailDuplicationCheckToDjango"]),

        async setRedirectData() {
            const code = this.$route.query.code;

            await this.requestAccessTokenToDjangoRedirection({ code });
            const userInfo = await this.requestUserInfoToDjango();

            const email = userInfo.kakao_account.email;

            console.log("11111email :", email);

            const isEmailDuplication =
                await this.requestEmailDuplicationCheckToDjango(email);

            if (isEmailDuplication === true) {
                console.log("기존 가입 고객입니다.");
                const accessToken = localStorage.getItem("accessToken");

                if (accessToken) {
                    await this.requestAddRedisAccessTokenToDjango({
                        email,
                        accessToken,
                    }); // Fix: Pass as object directly
                } else {
                    console.error("AccessToken is missing");
                }

                this.$router.push("/chatting-room");
            } else {
                console.log("신규 가입 고객입니다.");
                this.$router.push("/chatting-room");
            }
        },
    },

    async created() {
        await this.setRedirectData();
    },
};
</script>
