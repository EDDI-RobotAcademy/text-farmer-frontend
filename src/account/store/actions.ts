import { ActionContext } from "vuex";
import { AccountState } from "./states";
import { AxiosResponse } from "axios";
import axiosInst from "@/utility/axiosInstance";

export type AccountActions = {
    requestEmailDuplicationCheckToDjango(
        context: ActionContext<AccountState, any>,
        email: string
    ): Promise<boolean>;

    requestCreateNewAccountToDjango(
        context: ActionContext<any, any>,
        accountInfo: { email: string }
    ): Promise<void>;

    requestFindEmailByAccountIdToDjango(
        context: ActionContext<AccountState, any>,
        accountId: number
    ): Promise<void>;
};

const actions: AccountActions = {
    async requestEmailDuplicationCheckToDjango(
        context: ActionContext<AccountState, any>,
        email: string
    ): Promise<boolean> {
        const response = await axiosInst.djangoAxiosInst.post(
            "/account/email-duplication-check",
            { email }
        );
        return response.data.isDuplicate;
    },

    async requestCreateNewAccountToDjango(
        context: ActionContext<any, any>,
        accountInfo: { email: string }
    ): Promise<void> {
        try {
            await axiosInst.djangoAxiosInst.post(
                "/account/register",
                accountInfo
            );
        } catch (error) {
            console.error("신규 계정 생성 실패:", error);
            throw error;
        }
    },

    async requestFindEmailByAccountIdToDjango(
        context: ActionContext<any, any>,
        accountId: number
    ): Promise<void> {
        try {
            const response: AxiosResponse<any> =
                await axiosInst.djangoAxiosInst.post("/account/find-email", {
                    accountId: accountId,
                });
            const email = response.data;

            return email;
        } catch (error) {
            console.error(
                "Error occured in requestFindEmailByAccountIdToDjango: ",
                error
            );
            throw error;
        }
    },
};

export default actions;
