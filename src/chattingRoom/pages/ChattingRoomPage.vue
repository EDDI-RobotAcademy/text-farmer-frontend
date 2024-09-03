<template>
    <div class="container">
        <div class="leftWrapper">광고 들어갈 영역</div>
        <div class="centerWrapper">
            <div class="chattingBox">채팅영역임</div>
            <div class="textbox">
                <div class="textbox-box">
                    <div class="textbox-face textbox-side"></div>
                    <div class="textbox-face textbox-bottom"></div>
                    <div class="textbox-face textbox-top"></div>
                    <div class="textbox-field">
                        <input
                            type="text"
                            placeholder="TextFarmer에게 질문하세요 !"
                            class="textbox-text"
                        />
                    </div>
                    <div class="textbox-action">
                        <div class="textbox-face textbox-side"></div>
                        <div class="textbox-face textbox-top"></div>
                        <div class="textbox-face textbox-bottom"></div>
                        <svg viewBox="0 0 24 24">
                            <path
                                d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z"
                            ></path>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
        <div class="rightWrapper">광고 들어갈 영역</div>
    </div>
</template>

<style scoped>
.container {
    width: 100vw;
    height: 100vh;
    display: flex;
}

.leftWrapper {
    width: 20%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--secondary-color);
}

.centerWrapper {
    width: 60%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 30px 10px;
}

.chattingBox {
    width: 100%;
    height: calc(100vh - 150px);
    max-height: calc(100vh - 150px);
    overflow: auto;
}

.rightWrapper {
    width: 20%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--secondary-color);
}

.textbox {
    width: 90%;
    height: 50px;
    position: relative;
    transform-style: preserve-3d;
    transform: perspective(800px) rotateY(0deg) rotateZ(0deg) rotateX(20deg);
}

.textbox-box {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 30px;
    box-shadow: inset 0 0 0 3px #272343;
    position: relative;
    animation: hover 4s alternate infinite;
    transform-style: preserve-3d;
    transition: all 0.2s ease;
    background-color: var(--secondary-color);
}

.textbox-field {
    width: 90%;
    display: flex;
    flex-direction: column;
    padding: 10px 15px 15px;
    align-self: stretch;
    border-radius: 5px;
    position: relative; /* Add this line */
    z-index: 10; /* Add this line to ensure it's on top of other elements */
    pointer-events: auto; /* Ensure pointer events are enabled */
}

.textbox-action {
    width: 80px;
    height: 50px;
    min-width: 80px;
    margin-right: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    transform-style: preserve-3d;
    animation: hover 4s -0.4s alternate infinite;
    background-color: var(--secondary-color);
    position: relative;
    transition: all 0.2s ease;
    cursor: pointer;
}

.textbox-action svg {
    fill: #272343;
    width: 65%;
    height: 65%;
    animation: hover 4s -0.6s alternate infinite;
    -webkit-filter: drop-shadow(0 0 15px rgba(0, 0, 0, 0.5));
}

.textbox-face {
    position: absolute;
    left: 0;
    outline: none;
    border: 4px solid transparent;
    background-image: linear-gradient(#fff, #fff),
        linear-gradient(45deg, var(--secondary-color), var(--primary-color));
    background-origin: border-box;
    background-clip: padding-box, border-box;
    box-sizing: border-box;
    background-size: 0% 200%, 100% 100%, 100% 200%;
    transition: all 0.5s;
}

.textbox-side {
    transform: rotateY(90deg);
    height: 100%;
    width: 20px;
    top: 0;
    transform-origin: 0% 50%;
}

.textbox-bottom {
    transform: rotateX(90deg);
    height: 20px;
    width: 100%;
    bottom: 0;
    transform-origin: 50% 100%;
}

.textbox-top {
    transform: rotateX(-90deg);
    height: 20px;
    width: 100%;
    top: 0;
    transform-origin: 50% 0;
}

.textbox-text {
    width: 100%;
    height: 100%;
    border: none;
    background-color: transparent;
    animation: hover 4s -0.4s alternate infinite;
    display: block;
    color: #272343;
    -webkit-filter: drop-shadow(0 0 15px rgba(0, 0, 0, 0.5));
}

.textbox-text::placeholder {
    color: #272343;
    opacity: 0.5;
}

.textbox-text:focus {
    outline: none;
}

@keyframes hover {
    from {
        transform: translateZ(10px);
    }
    to {
        transform: translateZ(20px);
    }
}
</style>
