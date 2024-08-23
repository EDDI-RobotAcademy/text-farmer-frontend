<template>
    <v-app>
        <navigation-menu-bar />
        <v-main>
            <router-view />
        </v-main>
    </v-app>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import NavigationMenuBar from "./navigationBar/NavigationMenuBar.vue";

export default defineComponent({
    components: { NavigationMenuBar },
    name: "App",

    data() {
        return {
            //
        };
    },
});
</script>

<style>
* {
    font-family: "OAGothic", sans-serif !important;
}

:root {
    --primary-color: #202020;
    --secondary-color: #f2f2f2;
    --tertiary-color: #8088b2;
}

@font-face {
    font-family: "OAGothic";

    src: url("assets/fonts/OAGothic-Medium.ttf") format("truetype");

    font-weight: 500;
}

@font-face {
    font-family: "OAGothic";

    src: url("assets/fonts/OAGothic-ExtraBold.ttf") format("truetype");

    font-weight: 800;
}
</style>
