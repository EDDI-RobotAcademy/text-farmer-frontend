import { ActionContext } from "vuex"
import { AICommandState } from "./states"
import { AxiosResponse } from "axios"
import axiosInst from "@/utility/axiosInstance"
import { REQUEST_AI_COMMAND_RESULT_TO_FASTAPI } from "./mutation-types"

export type AICommandActions = {
    requestAICommandToFastAPI(
        context: ActionContext<AICommandState, any>, 
        payload: { userQuestion: string; aiCommand: number }
    ): Promise<void>
    requestProcessedAICommandResultToFastAPI(context: ActionContext<AICommandState, any>): Promise<void>
}

const actions: AICommandActions = {
    async requestAICommandToFastAPI(
        context: ActionContext<AICommandState, any>, 
        payload: { userQuestion: string; aiCommand: number }
    ): Promise<void> {
        console.log('requestAICommandToFastAPI -> aiCommand:', payload.aiCommand)
        console.log('requestpayload.ToFastAPI -> userQuestion:', payload.userQuestion)
        try {
            console.log(payload.aiCommand, context)
            const res = await axiosInst.fastapiAxiosInst.post(`/request-ai-command`, {
                "command": payload.aiCommand,
                "data": [payload.userQuestion]
            });
            console.log('data:', res.data)
        } catch (error) {
            console.error('requestAICommandToFastAPI() 문제 발생:', error);
            // throw error
        }
    },
    async requestProcessedAICommandResultToFastAPI(context: ActionContext<AICommandState, any>): Promise<void> {
        try {
            const res: AxiosResponse<any, any> = await axiosInst.fastapiAxiosInst.post('/find_similar');
            console.log('data:', res)
            const data = res.data;
            console.log('data:', data)
            context.commit('REQUEST_AI_COMMAND_RESULT_TO_FASTAPI', data);
        } catch (error) {
            console.error('Error fetching board list:', error);
            throw error
        }
    },
};

export default actions;