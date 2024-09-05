<template>
    <div class="container" v-if="mbti === 'T'">
        <div class="leftWrapper">
            <video
                :src="require('@/assets/videos/gtp.mp4')"
                autoplay
                muted
                loop
                class="video"
            />
            <div class="adText">
                <div>인생의 마지막 순간</div>
                <div>GTP와 함께</div>
                <div>풀매수 드가자~</div>
            </div>
        </div>

        <div class="centerWrapper">
            <div class="menu">
                <span>T-F</span>
                <v-menu :close-on-content-click="false">
                    <template v-slot:activator="{ props }">
                        <v-btn
                            icon="mdi-dots-vertical"
                            variant="text"
                            v-bind="props"
                        ></v-btn>
                    </template>

                    <v-card min-width="300" class="card">
                        <v-list>
                            <v-list-item
                                prepend-avatar="https://cdn.vuetifyjs.com/images/john.jpg"
                                :title="email"
                            >
                            </v-list-item>
                        </v-list>

                        <v-list>
                            <v-list-item>
                                <span class="switcher switcher-1">
                                    <input
                                        type="checkbox"
                                        id="switcher-1"
                                        v-model="isChecked"
                                    />
                                    <label for="switcher-1"></label>
                                </span>
                            </v-list-item>

                            <v-list-item>
                                <v-list-item-title>
                                    로그아웃
                                </v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-card>
                </v-menu>
            </div>

            <div class="chattingBox">
                <div
                    v-for="(message, index) in chatLog"
                    :key="index"
                    :class="{
                        'user-message': message.sender === 'user',
                        'ai-message typed': message.sender === 'ai',
                    }"
                    class="chatMessage"
                >
                    <span v-if="message.sender === 'user'">
                        {{ message.text }}
                    </span>
                    <span v-else v-html="message.typedText"></span>
                    <self-building-square-spinner
                        v-if="message.text === ''"
                        :animation-duration="6000"
                        :size="40"
                        color="var(--secondary-color)"
                    />
                </div>
            </div>

            <textarea
                type="text"
                placeholder="TextFarmer에게 질문하세요 !"
                v-model="userInput"
                class="userInput"
                cols="4"
                @keydown="pressEnter"
            />

            <div class="caution">
                TextFarmer는 실수를 할 수 있습니다. 정확한 진단은 병원에 가세요.
            </div>
        </div>

        <div class="rightWrapper">
            <video
                :src="require('@/assets/videos/quack.mp4')"
                autoplay
                muted
                loop
                class="video blinking"
            />
            <div class="adText">
                <div>60만원 충전시</div>
                <div>10만 포인트 무료</div>
                <div>인생도박 드가자~</div>
            </div>
        </div>
    </div>

    <div v-if="mbti === 'F'" width="100vw" height="100vh">
        <img :src="require('@/assets/images/fixed/ghost.png')" width="100%" />
    </div>
</template>

<script>
import { mapActions } from "vuex";
import { SelfBuildingSquareSpinner } from "epic-spinners";

const aiCommandModule = "aiCommandModule";
const authenticationModule = "authenticationModule";
const accountModule = "accountModule";

export default {
    components: {
        SelfBuildingSquareSpinner,
    },

    data() {
        return {
            email: null,
            userInput: "",
            chatLog: [],
            isChecked: false,
            mbti: "T",
        };
    },

    async created() {
        const userToken = localStorage.getItem("userToken");

        if (userToken) {
            await this.requestUserInfoByUserToken();
        } else {
            await this.requestUserInfo().then(async () => {
                await this.registerUserInfo();
            });
        }
    },

    watch: {
        isChecked(newVal) {
            this.mbti = newVal ? "F" : "T";
        },
    },

    methods: {
        ...mapActions(aiCommandModule, [
            "requestAICommandToFastAPI",
            "requestProcessedAICommandResultToFastAPI",
        ]),
        ...mapActions(authenticationModule, [
            "requestUserInfoToDjango",
            "requestAddRedisAccessTokenToDjango",
            "requestAccountByRedisAccessTokenToDjango",
        ]),
        ...mapActions(accountModule, [
            "requestCreateNewAccountToDjango",
            "requestFindEmailByAccountIdToDjango",
        ]),

        async requestUserInfoByAccessToken() {
            try {
                const userInfo = await this.requestUserInfoToDjango();
                this.email = userInfo.kakao_account.email;
            } catch (error) {
                console.error(
                    "Error occured in requestUserInfoByAccessToken:",
                    error
                );
                alert("정상적인 접근이 아닙니다. 로그인을 먼저 해주세요.");
            }
        },

        async requestUserInfoByUserToken() {
            try {
                const userToken = localStorage.getItem("userToken");
                const accountId =
                    await this.requestAccountByRedisAccessTokenToDjango(
                        userToken
                    );
                const email = await this.requestFindEmailByAccountIdToDjango(
                    accountId
                );

                this.email = email.email;
            } catch (error) {
                console.error(
                    "Error occured in requestUserInfoByUserToken:",
                    error
                );
                alert("정상적인 접근이 아닙니다. 로그인을 먼저 해주세요.");
            }
        },

        async registerUserInfo() {
            const accountInfo = { email: this.email };

            await this.requestCreateNewAccountToDjango(accountInfo);

            const accessToken = localStorage.getItem("accessToken");
            const email = accountInfo.email;

            await this.requestAddRedisAccessTokenToDjango({
                email,
                accessToken,
            });
        },

        async onClickRequestAI() {
            this.chatLog.push({ sender: "user", text: this.userInput });

            const aiMessageIndex =
                this.chatLog.push({
                    sender: "ai",
                    text: "",
                    typedText: "",
                }) - 1;

            this.requestAICommandToFastAPI({
                command: 34,
                data: [this.userInput, this.mbti],
            }).then(async () => {
                let res = await this.requestProcessedAICommandResultToFastAPI();

                if (
                    res ===
                    "아직 데이터를 처리 중이거나 요청한 데이터가 없습니다."
                ) {
                    const intervalRequest = setInterval(async () => {
                        res =
                            await this.requestProcessedAICommandResultToFastAPI();

                        if (
                            res !==
                            "아직 데이터를 처리 중이거나 요청한 데이터가 없습니다."
                        ) {
                            clearInterval(intervalRequest);

                            this.chatLog[aiMessageIndex].text = res.output;
                            this.startTypingEffect(aiMessageIndex);
                        }
                    }, 3000);
                } else {
                    this.chatLog[aiMessageIndex].text = res.output;
                    this.startTypingEffect(aiMessageIndex);
                }
            });

            this.userInput = "";
        },

        startTypingEffect(index) {
            let currentMessage = this.chatLog[index];
            currentMessage.typedText = "";

            const typingInterval = setInterval(() => {
                if (
                    currentMessage.typedText.length < currentMessage.text.length
                ) {
                    currentMessage.typedText += currentMessage.text
                        .charAt(currentMessage.typedText.length)
                        .replace(/\n/g, "<br>");
                } else {
                    clearInterval(typingInterval);
                }
            }, 50);
        },

        pressEnter(e) {
            if (e.isComposing) {
                return;
            }

            if (e.key === "Enter" && e.shiftKey) {
                return;
            } else if (e.key === "Enter") {
                e.preventDefault();
                this.onClickRequestAI();
            }
        },
    },

    mounted() {
        document.getElementsByTagName("video")[0].playbackRate = 0.4;
    },
};
</script>

<style scoped>
.container {
    width: 100vw;
    height: 100vh;
    display: flex;
}

.leftWrapper {
    width: 20%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10px;
    background-color: var(--secondary-color);
}

.video {
    width: 100%;
    height: 90%;
    object-fit: fill;
}

.adText {
    width: 100%;
    height: 10%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: var(--secondary-color);
    background-color: #121212;
    font-size: 1.25rem;
}

.centerWrapper {
    width: 60%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10px 10px 20px 10px;
}

.menu {
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 20px;
    padding-right: 20px;
    background-color: var(--secondary-color);
}

.chattingBox {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    max-height: 100%;
    margin-top: 20px;
    overflow: auto;
}

.rightWrapper {
    width: 20%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10px;
    background-color: var(--secondary-color);
}

.userInput {
    width: 100%;
    margin-top: 20px;
    margin-bottom: 10px;
    padding: 1em;
    border: none;
    outline: none;
    border-radius: 15px;
    background-color: #ccc;
    box-shadow: inset 2px 5px 10px rgba(0, 0, 0, 0.3);
    transition: 300ms ease-in-out;
    resize: none;
}

.userInput:focus {
    background-color: white;
    transform: scale(1.005);
    box-shadow: 5px 5px 10px #969696, -5px -5px 10px #ffffff;
}

.caution {
    font-size: 0.875vw;
    color: #969696;
}

.chatMessage {
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 10px;
    max-width: 70%;
}

.typed {
    line-height: 35px;
    max-width: 80%;
    text-align: left;
}

@keyframes blink {
    from,
    to {
        color: transparent;
    }
    50% {
        color: rgba(245, 245, 245);
    }
}

.user-message {
    position: right;
    background-color: var(--secondary-color);
    align-self: flex-end;
}

.ai-message {
    padding: 20px;
    position: left;
    background-color: #a2a8c263;
    align-self: baseline;
}

.card {
    display: flex;
    flex-direction: column;
}

.switcher {
    display: flex;
    position: relative;
    width: 200px;
    height: 50px;
    border-radius: 25px;
}

.switcher input {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    position: relative;
    width: 200px;
    height: 50px;
    border-radius: 25px;
    background-color: #1e1e1e;
    outline: none;
    font-family: "Oswald", sans-serif;
}

.switcher input:before,
.switcher input:after {
    z-index: 2;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    color: #ffffff;
}

.switcher input:before {
    content: "F로 변환";
    left: 20px;
}

.switcher input:after {
    content: "T로 변환";
    right: 20px;
}

.switcher label {
    z-index: 1;
    position: absolute;
    top: 10px;
    bottom: 10px;
    border-radius: 20px;
}

.switcher.switcher-1 input {
    transition: 0.25s -0.1s;
}

.switcher.switcher-1 input:checked {
    background-color: var(--secondary-color);
}

.switcher.switcher-1 input:checked:before {
    color: #ffffff;
    transition: color 0.5s 0.2s;
}

.switcher.switcher-1 input:checked:after {
    color: #cccccc;
    transition: color 0.5s;
}

.switcher.switcher-1 input:checked + label {
    left: 10px;
    right: 100px;
    background: #1e1e1e;
    transition: left 0.5s, right 0.4s 0.2s;
}

.switcher.switcher-1 input:not(:checked) {
    background: #1e1e1e;
    transition: background 0.5s -0.1s;
}

.switcher.switcher-1 input:not(:checked):before {
    color: #cccccc;
    transition: color 0.5s;
}

.switcher.switcher-1 input:not(:checked):after {
    color: #1e1e1e;
    transition: color 0.5s 0.2s;
}

.switcher.switcher-1 input:not(:checked) + label {
    left: 100px;
    right: 10px;
    background: #ffffff;
    transition: left 0.4s 0.2s, right 0.5s, background 0.35s -0.1s;
}

.switcher.switcher-2 {
    overflow: hidden;
}

.switcher.switcher-2 input {
    transition: background-color 0s 0.5s;
}

.switcher.switcher-2 input:before {
    color: #1e1e1e;
}

.switcher.switcher-2 input:after {
    color: #ffffff;
}

.switcher.switcher-2 input:checked {
    background-color: #ffffff;
}

.switcher.switcher-2 input:checked + label {
    background: #ffffff;
    -webkit-animation: turn-on 0.5s ease-out;
    animation: turn-on 0.5s ease-out;
}

@-webkit-keyframes turn-on {
    0% {
        left: 100%;
    }
    100% {
        left: 0%;
    }
}

@keyframes turn-on {
    0% {
        left: 100%;
    }
    100% {
        left: 0%;
    }
}

.switcher.switcher-2 input:not(:checked) {
    background: #1e1e1e;
}

.switcher.switcher-2 input:not(:checked) + label {
    background: #1e1e1e;
    -webkit-animation: turn-off 0.5s ease-out;
    animation: turn-off 0.5s ease-out;
}

@-webkit-keyframes turn-off {
    0% {
        right: 100%;
    }
    100% {
        right: 0%;
    }
}

@keyframes turn-off {
    0% {
        right: 100%;
    }
    100% {
        right: 0%;
    }
}

.switcher.switcher-2 label {
    top: 0px;
    width: 200px;
    height: 50px;
    border-radius: 25px;
}

.blinking {
    -webkit-animation: blink 0.5s ease-in-out infinite alternate;
    -moz-animation: blink 0.5s ease-in-out infinite alternate;
    animation: blink 0.5s ease-in-out infinite alternate;
}
@-webkit-keyframes blink {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}
@-moz-keyframes blink {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}
@keyframes blink {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}
</style>
