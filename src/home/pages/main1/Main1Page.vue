<template>
    <div class="container">
        <div class="wrapper">
            <div class="panel panelT">
                <div class="textT">T</div>
            </div>
            <div class="panel fakePin panelExt">
                <div class="textExt">ext</div>
            </div>
            <div class="panel panelFarmer">
                <div class="textFarmer">Farmer</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, onUnmounted } from "vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

const scrubValue = 0.5;

onMounted(() => {
    let container = document.querySelector(".container");
    const textTElement = document.querySelector(".textT");
    const textExtElement = document.querySelector(".textExt");
    const textFarmerElement = document.querySelector(".textFarmer");
    const textTWidth = textTElement.offsetWidth;
    const textExtWidth = textExtElement.offsetWidth;
    const textFarmerWidth = textFarmerElement.offsetWidth;

    ScrollTrigger.create({
        trigger: ".container",
        start: "top top",
        end: () => container.scrollWidth - window.innerWidth,
        pin: true,
        anticipatePin: 1,
        scrub: scrubValue,
        invalidateOnRefresh: true,
    });

    let thumbNails = gsap.utils.toArray(".panel");

    gsap.to(".textT", {
        duration: 3,
        backgroundPosition: "100% 100%",
        ease: "power2.inOut",
        onComplete: () => {
            gsap.to(".textT", {
                x: () => window.innerWidth - textExtWidth + textTWidth,
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
                        const textTRect = textTElement.getBoundingClientRect();

                        if (textTRect.right > panelExtRect.left) {
                            const overlapWidth =
                                textTRect.right - panelExtRect.left;

                            textTElement.style.background = `
                                    linear-gradient(to left, #202020 ${overlapWidth}px, #ffffff ${overlapWidth}px)
                                `;
                            textTElement.style.webkitBackgroundClip = "text";
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

    thumbNails.forEach((thumb, i) => {
        if (thumb.classList.contains("fakePin")) {
            const prevAll = (element) => {
                var result = [];

                while ((element = element.previousElementSibling))
                    result.push(element);
                return result;
            };

            var totalWidthToMove;

            const getTotalWidthToMove = () => {
                totalWidthToMove = 0;

                prevAll(thumb).forEach((thumbBefore, i) => {
                    let style =
                        thumbBefore.currentStyle ||
                        window.getComputedStyle(thumbBefore);
                    let marginRight = parseInt(style.marginRight);

                    totalWidthToMove += thumbBefore.offsetWidth + marginRight;
                });

                return totalWidthToMove;
            };

            gsap.to(thumb, {
                x: () => {
                    return -getTotalWidthToMove();
                },
                ease: "none",
                scrollTrigger: {
                    trigger: ".wrapper",
                    start: "top top",
                    scrub: scrubValue,
                    invalidateOnRefresh: true,
                    end: () => "+=" + getTotalWidthToMove(),
                },
            });
        } else {
            gsap.to(thumb, {
                x: () => {
                    return -container.scrollWidth;
                },
                ease: "none",
                scrollTrigger: {
                    trigger: ".wrapper",
                    start: "top top",
                    scrub: scrubValue,
                    invalidateOnRefresh: true,
                    end: () => "+=" + container.scrollWidth,
                },
            });
        }
    });

    gsap.to(".textFarmer", {
        x: () => -window.innerWidth,
        delay: 0.5,
        scrollTrigger: {
            trigger: ".panelExt",
            start: "center+=100% 40%",
            end: "+=" + 200 + "%",
            scrub: true,
        },
    });
});
</script>

<style scoped>
body {
    overflow-x: hidden;
    margin: 0;
    padding: 0;
}

::-webkit-scrollbar {
    display: none;
}

.wrapper {
    position: relative;

    width: 300vw;
    height: 100vh;
}

.panel {
    display: inline-block;
    height: 100vh;
    width: 100vw;
    font-size: 450px;
    font-weight: bold;
}

.panel:nth-child(1) {
    background-color: #202020;
}

.textT {
    background: linear-gradient(0deg, #fff 50%, transparent 50%);
    -webkit-background-clip: text;
    -webkit-text-stroke: 1px #fff;
    background-clip: text;
    color: transparent;
    background-size: 100% 200%;
    background-position: 0% 0%;
    position: absolute; /* 부모 요소를 기준으로 위치 설정 */
    top: 50%; /* 수직 중앙 정렬 */
    left: 50%; /* 수평 중앙 정렬 */
    transform: translate(-50%, -50%); /* 중앙으로 이동 */
    white-space: nowrap; /* 텍스트 줄 바꿈 방지 */
}

.panel:nth-child(2) {
}

.textExt {
    position: absolute; /* 부모 요소를 기준으로 위치 설정 */
    top: 50%; /* 수직 중앙 정렬 */
    left: 50%; /* 수평 중앙 정렬 */
    transform: translate(-50%, -50%); /* 중앙으로 이동 */
    white-space: nowrap; /* 텍스트 줄 바꿈 방지 */
}

.panel:nth-child(3) {
    background-color: gray;
}

.textFarmer {
    position: absolute; /* 부모 요소를 기준으로 위치 설정 */
    top: 50%; /* 수직 중앙 정렬 */
    left: 50%; /* 수평 중앙 정렬 */
    transform: translate(-50%, -50%); /* 중앙으로 이동 */
    white-space: nowrap; /* 텍스트 줄 바꿈 방지 */
}
</style>
