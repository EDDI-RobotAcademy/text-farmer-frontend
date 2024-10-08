import { ActionContext } from "vuex";
import { AuthenticationState } from "./states";
import { AxiosResponse } from "axios";
import axiosInst from "@/utility/axiosInstance";

export type AuthenticationActions = {
    requestKakaoOauthRedirectionToDjango(): Promise<void>;

    requestAccessTokenToDjangoRedirection(
        context: ActionContext<AuthenticationState, any>,
        payload: { code: string }
    ): Promise<void>;

    requestUserInfoToDjango(
        context: ActionContext<AuthenticationState, any>
    ): Promise<any>;

    requestAddRedisAccessTokenToDjango(
        context: ActionContext<AuthenticationState, any>,
        { email, accessToken }: { email: string; accessToken: string }
    ): Promise<any>;

    requestAccountByRedisAccessTokenToDjango(
        context: ActionContext<AuthenticationState, any>,
        userToken: string
    ): Promise<any>;

    requestLogoutToDjango(
        context: ActionContext<AuthenticationState, any>,
        userToken: string
    ): Promise<void>;
};

const actions: AuthenticationActions = {
    async requestKakaoOauthRedirectionToDjango(): Promise<void> {
        return axiosInst.djangoAxiosInst.get("/oauth/kakao").then((res) => {
            window.location.href = res.data.url;
        });
    },

    async requestAccessTokenToDjangoRedirection(
        context: ActionContext<AuthenticationState, any>,
        payload: { code: string }
    ): Promise<void> {
        try {
            const { code } = payload;
            const response = await axiosInst.djangoAxiosInst.post(
                "/oauth/kakao/access-token",
                { code }
            );

            console.log(
                "response of requestAccessTokenToDjangoRedirection: ",
                response
            );

            localStorage.setItem(
                "accessToken",
                response.data.accessToken.access_token
            );
        } catch (error) {
            console.log("Access Token 요청 중 문제 발생:", error);
            throw error;
        }
    },

    async requestUserInfoToDjango(
        context: ActionContext<AuthenticationState, any>
    ): Promise<any> {
        try {
            const accessToken = localStorage.getItem("accessToken");

            const userInfoResponse: AxiosResponse<any> =
                await axiosInst.djangoAxiosInst.post("/oauth/kakao/user-info", {
                    access_token: accessToken,
                });

            const userInfo = userInfoResponse.data.user_info;

            return userInfo;
        } catch (error) {
            alert("사용자 정보 가져오기 실패!");

            throw error;
        }
    },

    async requestAddRedisAccessTokenToDjango(
        { commit, state }: ActionContext<AuthenticationState, any>,
        { email, accessToken }: { email: string; accessToken: string }
    ): Promise<any> {
        try {
            const response: AxiosResponse<any> =
                await axiosInst.djangoAxiosInst.post(
                    "/oauth/redis-access-token/",
                    {
                        email: email,
                        accessToken: accessToken,
                    }
                );

            localStorage.removeItem("accessToken");
            localStorage.setItem("userToken", response.data.userToken);
            commit("REQUEST_IS_AUTHENTICATED_TO_DJANGO", true);
            return response.data;
        } catch (error) {
            console.error("Error adding redis access token:", error);
            throw error;
        }
    },

    async requestAccountByRedisAccessTokenToDjango(
        context: ActionContext<AuthenticationState, any>,
        userToken: string
    ): Promise<void> {
        try {
            const response = await axiosInst.djangoAxiosInst.post(
                "/oauth/find-account",
                {
                    userToken: userToken,
                }
            );

            return response.data.accountId;
        } catch (error) {
            console.error(
                "Error occured in requestAccountByRedisAccessTokenToDjango()",
                error
            );
            throw error;
        }
    },

    async requestLogoutToDjango(
        context: ActionContext<AuthenticationState, any>,
        userToken: string
    ): Promise<void> {
        try {
            const userToken = localStorage.getItem("userToken");

            const res = await axiosInst.djangoAxiosInst.post("/oauth/logout", {
                userToken: userToken,
            });

            console.log("res:", res.data.isSuccess);
            if (res.data.isSuccess === true) {
                context.commit("REQUEST_IS_AUTHENTICATED_TO_DJANGO", false);
            }
        } catch (error) {
            console.error("requestPostToFastapi() 중 에러 발생:", error);
            throw error;
        }
        localStorage.removeItem("userToken");
    },
};

export default actions;
