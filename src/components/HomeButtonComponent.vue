<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();

const sendHome = () => {
  router.push("/");
};
</script>

<template>
  <button @click="sendHome()" class="lift home-button" name="home-button">
    cd ~/
  </button>
</template>

<style scoped lang="less">
@import "@/assets/main.less";

.home-button {
  width: 100px;
  height: 40px;
  padding: 10px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: monospace;
  font-weight: 500;
  font-size: 16px;

  color: @primary;

  &:hover {
    background: rgb(243, 190, 110);
  }
}
</style>
