<template>
    <v-container>
        <h2>DLLS Test</h2>\
        <v-btn color="secondary" @click="onClickRequestAI">답변 요청 버튼</v-btn>
        <v-btn color="success" @click="onClickGetResult">결과 확인 버튼</v-btn>
    </v-container>
</template>

<script>
import { mapActions } from 'vuex'
const aiCommandModule = 'aiCommandModule'

export default {
    methods: {
        ...mapActions(aiCommandModule, [
            'requestAICommandToFastAPI', 
            'requestProcessedAICommandResultToFastAPI'
        ]),
        onClickRequestAI () {
            console.log("답변 요청 버튼 누름")
            this.requestAICommandToFastAPI({ userQuestion: "배아파", aiCommand: 34 })
        },
        onClickGetResult () {
            console.log("결과 확인 버튼 누름")
            const processedAICommandResult = 
            this.requestProcessedAICommandResultToFastAPI()
            console.log('AI 명령 처리 결과:', processedAICommandResult)
        },
    }
}
</script>