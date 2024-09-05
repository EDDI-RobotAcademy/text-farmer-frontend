export interface AICommandState {
    userQuestion: string
    aiCommand: number
    aiCommandResult: unknown
}

const state: AICommandState = {
    userQuestion: "",
    aiCommand: 0,
    aiCommandResult: {} as any, // 뭐든지 다 돼
}

export default state