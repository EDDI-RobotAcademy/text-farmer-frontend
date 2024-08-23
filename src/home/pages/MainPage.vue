<template>
    <button class="loginButton">로그인</button>
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
            안녕하세요<br />
            소개글 영역입니다.<br /><br />
            소개글 영역입니다2<br />
            소개글 영역입니다3<br />
            소개글 영역입니다4<br />
            <button>로그인 버튼</button>
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
    ctx = gsap.context(() => {
        const panels = gsap.utils.toArray(".panel");
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
            duration: 2.5,
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
                        // return textTRect.width - textExtRect.width;
                        return textExtRect.width - textTRect.right;
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
            x: () => -window.innerWidth,
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
    font-family: "Signika Negative", sans-serif, Arial;
}

.loginButton {
    width: 5%;
    height: 5%;
    position: fixed;
    top: 1%;
    right: 2%;
    z-index: 5;
    color: #8088b2;
    font-weight: bold;
    border: 1px solid #8088b2;
}

.section {
    width: 100%;
    height: 100vh;
    background-color: tomato;
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
    background-color: #202020;
    transform: none !important;
}

.textT {
    background: linear-gradient(0deg, #fff 50%, transparent 50%);
    -webkit-background-clip: text;
    -webkit-text-stroke: 1px #fff;
    background-clip: text;
    color: transparent;
    background-size: 100% 200%;
    background-position: 0% 0%;
    z-index: 1;
}

.panel:nth-child(2) {
    background-color: #ffffff;
}

.panel:nth-child(3) {
    background-color: #ffffff;
    z-index: -1;
}

.panel:nth-child(4) {
    background-color: #202020;
    z-index: 2;
}

.textFarmer {
    color: #ffffff;
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
    color: #202020;
}

.introduce {
    white-space: nowrap;
    font-size: 3rem;
    font-weight: bold;
}
</style>
