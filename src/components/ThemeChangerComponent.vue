<script setup lang="ts">
import { ref } from "vue";

const theme = ref<string>(
  document.querySelector("html")!.dataset["theme"] || "light"
);

const changeTheme = () => {
  switch (theme.value) {
    case "light":
      theme.value = "dark";
      break;
    case "dark":
      theme.value = "light";
      break;
    default:
      break;
  }

  document.querySelector("html")!.dataset["theme"] = theme.value;
  localStorage.setItem("theme", theme.value);
};
</script>

<template>
  <button class="theme-changer lift" @click="changeTheme()">
    <font-awesome-icon icon="fa-regular fa-sun" v-show="theme == 'light'" />
    <font-awesome-icon icon="fa-regular fa-moon" v-show="theme == 'dark'" />
  </button>
</template>

<style lang="less" scoped>
@import "@/assets/main.less";
.theme-changer {
  width: 60px;
  height: 40px;
  padding: 10px;
  background: @accent;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 10px;
  &:hover {
    background: rgb(243, 190, 110);
  }
}
</style>
