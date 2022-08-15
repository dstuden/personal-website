<script setup lang="ts">
import { onMounted, onUpdated } from "vue";

const props = defineProps<{
  message: string;
  shown: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

onUpdated(() => {
  if (props.shown)
    setTimeout(() => {
      emit("close");
    }, 5000);
});
</script>

<template>
  <Teleport to="body">
    <Transition>
      <div class="notif" v-if="shown">
        <p>{{ message }}</p>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="less" scoped>
@import "@/assets/main.less";

.v-enter-active,
.v-leave-active {
  transition: all 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

.notif {
  position: fixed;
  top: 64px;
  right: 20px;
  width: 200px;
  height: auto;
  padding: 10px;
  border-radius: 10px;
  background: @accent;
}
</style>
