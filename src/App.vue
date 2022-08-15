<script setup lang="ts">
import { onBeforeMount } from "vue";
import { RouterView, useRoute } from "vue-router";
import ThemeChangerComponent from "@/components/ThemeChangerComponent.vue";
import HomeButtonComponent from "@/components/HomeButtonComponent.vue";

import { library } from "@fortawesome/fontawesome-svg-core";

import {
  faSuitcase,
  faSchool,
  faGamepad,
  faCode,
  faAddressCard,
  faListCheck,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";

import { faSun, faMoon } from "@fortawesome/free-regular-svg-icons";

import {
  faTelegram,
  faDiscord,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";

library.add(
  faSuitcase,
  faSchool,
  faGamepad,
  faCode,
  faAddressCard,
  faListCheck,
  faMoon,
  faSun,
  faEnvelope,
  faTelegram,
  faDiscord,
  faGithub
);

const route = useRoute();

const theme = localStorage.getItem("theme");

onBeforeMount(() => {
  if (!theme) {
    document.querySelector("html")!.dataset["theme"] = "light";
    localStorage.setItem("theme", "light");
  } else document.querySelector("html")!.dataset["theme"] = theme;
});

console.log(theme);
</script>

<template>
  <nav class="navbar">
    <ThemeChangerComponent class="theme-changer"></ThemeChangerComponent>
    <div />
    <HomeButtonComponent v-show="route.fullPath != '/'"></HomeButtonComponent>
  </nav>
  <Transition name="change-route">
    <RouterView></RouterView>
  </Transition>
</template>

<style scoped lang="less">
@import "@/assets/base.less";

.change-route-enter-active,
.change-route-leave-active {
  transition: all 0.5s ease;
}

.change-route-enter-from,
.change-route-leave-to {
  opacity: 0;
  transform: translateX(500px);
}

.navbar {
  position: fixed;
  z-index: 1;
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  padding: 10px 20px;
}
</style>
