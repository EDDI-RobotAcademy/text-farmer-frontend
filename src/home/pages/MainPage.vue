<template>
    <router-link to="/account/login" class="loginButtonRouter">
        <button class="loginButton">로그인</button>
    </router-link>

    <div class="section wrapper">
        <div class="content">
            <div class="panel panelT">
                <div class="textT">T</div>
            </div>
            <div class="panel panelExt">
                <div class="textExt">ext</div>
            </div>
            <div class="panel panelNothing">
                <div></div>
            </div>
            <div class="panel panelFarmer">
                <div class="textFarmer">Farmer</div>
            </div>
        </div>
    </div>
    <div class="section2 wrapper">
        <div class="about">ABOUT</div>
        <div class="introduce">
            <h1 class="text">돌팔이<span>보다 정확한</span></h1>
            <br />
            <h1 class="text">전문가<span>보다 가까운</span></h1>
            <br />
            <h1 class="text">헬스케어<span>챗봇 서비스</span></h1>
            <br />
            <h1 class="text">
                아직 회원이 아니신가요?
                <span>
                    <router-link to="/account/login">
                        여기를 눌러 지금 바로 가입하세요.
                    </router-link>
                </span>
            </h1>
        </div>
    </div>
</template>

<script setup>
import { onMounted, onUnmounted } from "vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

let ctx;

onMounted(() => {
    window.onload = function () {
        this.setTimeout(function () {
            scrollTo(0, 0);
        }, 100);
    };

    ctx = gsap.context(() => {
        const panels = gsap.utils.toArray(".panel");
        const introudceTextElements = gsap.utils.toArray(".text");
        const textTElement = document.querySelector(".textT");
        const textExtElement = document.querySelector(".textExt");

        const textTRect = textTElement.getBoundingClientRect();
        const textExtRect = textExtElement.getBoundingClientRect();

        let scrollTimeout;

        let scrollPosition = window.scrollY;

        const preventScroll = () => {
            window.scrollTo(0, scrollPosition);
        };

        window.addEventListener("scroll", preventScroll);

        gsap.to(panels, {
            xPercent: (i) => -100 * i,
            // x: (i) => i && 50 * (i - 1),
            duration: (i) => i,
            ease: "none",
            scrollTrigger: {
                trigger: ".wrapper",
                start: "top top",
                end: "+=" + 100 * panels.length + "5",
                scrub: true,
                pin: true,
            },
        });

        gsap.to(".textT", {
            duration: 0.1,
            backgroundPosition: "100% 100%",
            ease: "power2.inOut",
            onComplete: () => {
                window.removeEventListener("scroll", preventScroll);

                const resetRotation = () => {
                    gsap.to(".textT", {
                        rotation: 0,
                        duration: 0.5,
                        ease: "power2.out",
                    });
                };

                gsap.to(".textT", {
                    rotation: () => 0,
                    scrollTrigger: {
                        trigger: ".panelT",
                        start: "top top",
                        end: "+=" + 140 + "%",
                        scrub: true,
                        onUpdate: (self) => {
                            const direction = self.direction;
                            const maxRotation = 2;

                            gsap.to(".textT", {
                                rotation:
                                    direction === 1
                                        ? maxRotation
                                        : -maxRotation,
                                duration: 0.1,
                                ease: "power1.out",
                            });

                            clearTimeout(scrollTimeout);
                            scrollTimeout = setTimeout(resetRotation, 150);
                        },
                    },
                });

                gsap.to(".textT", {
                    x: () => {
                        return 0 - textExtRect.width / 2 - textTRect.width / 2;
                    },
                    scrollTrigger: {
                        trigger: ".panelT",
                        start: "center 5%",
                        end: "+=" + 100 + "%",
                        scrub: true,
                        onUpdate: (self) => {
                            const panelExtElement =
                                document.querySelector(".panelExt");
                            const panelExtRect =
                                panelExtElement.getBoundingClientRect();
                            const textTRect =
                                textTElement.getBoundingClientRect();

                            if (textTRect.right > panelExtRect.left) {
                                const overlapWidth =
                                    textTRect.right - panelExtRect.left;

                                textTElement.style.background = `
                                    linear-gradient(to left, #202020 ${overlapWidth}px, #ffffff ${overlapWidth}px)
                                `;
                                textTElement.style.webkitBackgroundClip =
                                    "text";
                                textTElement.style.backgroundClip = "text";
                                textTElement.style.color = "transparent";
                            } else {
                                const overlapWidth =
                                    textTRect.right - panelExtRect.left;

                                if (overlapWidth <= 0) {
                                    textTElement.style.background = "none";
                                    textTElement.style.color = "#ffffff";
                                }
                            }
                        },
                    },
                });
            },
        });

        gsap.to(".textFarmer", {
            x: () => {
                return -window.innerWidth;
            },
            scrollTrigger: {
                trigger: ".panelNothing",
                start: "center+=100% 0%",
                // end: "+=" + 150 + "%",
                scrub: true,
            },
        });

        gsap.to(".about", {
            y: window.innerHeight * 2.5,
            scrollTrigger: {
                trigger: ".section2",
                start: "top-=80% top",
                scrub: 1.5,
            },
        });

        gsap.to(".introduce", {
            x: () => -window.innerWidth / 2,
            scrollTrigger: {
                trigger: ".section2",
                start: "top-=200% top",
                scrub: false,
            },
        });

        introudceTextElements.forEach((text) => {
            gsap.to(text, {
                backgroundSize: "100%",
                ease: "none",
                scrollTrigger: {
                    trigger: text,
                    start: "center 100%",
                    end: "center 100%",
                    scrub: true,
                },
            });
        });
    });
});

onUnmounted(() => {
    ctx && ctx.revert();
});
</script>

<style scoped>
* {
    box-sizing: border-box;
}

body {
    margin: 0;
}

.loginButtonRouter {
    cursor: pointer;
}

.loginButton {
    width: 5%;
    height: 5%;
    position: fixed;
    top: 1%;
    right: 2%;
    z-index: 5;
    color: var(--tertiary-color);
    font-weight: bold;
    border: 1px solid var(--tertiary-color);
}

a {
    color: var(--tertiary-color);
    text-decoration: none;
}

.section {
    width: 100%;
    height: 100vh;
}

.wrapper {
    display: flex;
}

.content {
    width: 100%;
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-wrap: nowrap;
}

.panel {
    height: 100vh;
    flex: 1 0 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 25rem;
    font-weight: bold;
}

.panel:nth-child(1) {
    background-color: var(--primary-color);
    transform: none !important;
}

.textT {
    background: linear-gradient(
        0deg,
        var(--secondary-color) 50%,
        transparent 50%
    );
    -webkit-background-clip: text;
    -webkit-text-stroke: 1px var(--secondary-color);
    background-clip: text;
    color: transparent;
    background-size: 100% 200%;
    background-position: 0% 0%;
    z-index: 1;
}

.panel:nth-child(2) {
    background-color: var(--secondary-color);
}

.textExt {
    color: var(--primary-color);
}

.panel:nth-child(3) {
    background-color: var(--secondary-color);
    z-index: -1;
}

.panel:nth-child(4) {
    background-color: var(--primary-color);
    z-index: 2;
}

.textFarmer {
    color: var(--secondary-color);
    text-shadow: 5px 5px 4px #bdbdbd;
}

.section2 {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
}

.about {
    font-size: 25rem;
    font-weight: 1000;
    transform: rotate(270deg);
    transform-origin: top left;
    color: var(--primary-color);
}

.introduce {
    display: flex;
    flex-direction: column;
    justify-content: center;
    white-space: nowrap;
    font-size: 3rem;
    font-weight: bold;
}

.text {
    font-size: 10vw;
    letter-spacing: -0.01em;
    line-height: 100%;
    margin: 0;

    width: 100%;
    color: rgb(182, 182, 182, 0.2);
    background: linear-gradient(
            to right,
            var(--primary-color),
            var(--primary-color)
        )
        no-repeat;
    -webkit-background-clip: text;
    background-clip: text;
    background-size: 0%;
    transition: background-size cubic-bezier(0.1, 0.5, 0.5, 1) 0.5s;

    border-bottom: 1px solid #2f2b28;

    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    position: relative;
}

.text:nth-of-type(4) {
    font-size: 4vw;
    color: var(--tertiary-color);
    cursor: pointer;
}

.text:nth-of-type(4) > span {
    font-size: 2.85vw;
    background-color: var(--tertiary-color);
}

.text:nth-of-type(4) > span > a {
    font-size: 2.85vw;
    color: var(--secondary-color);
    background-color: var(--tertiary-color);
}

span {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: var(--primary-color);
    color: var(--secondary-color);
    font-size: 7vw;

    clip-path: polygon(0 50%, 100% 50%, 100% 50%, 0 50%);
    transform-origin: center;
    transition: all cubic-bezier(0.1, 0.5, 0.5, 1) 0.4s;

    display: flex;
    flex-direction: column;
    justify-content: center;
}

.text:hover > span {
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
}

.divider {
    height: 10px;
}
</style>
