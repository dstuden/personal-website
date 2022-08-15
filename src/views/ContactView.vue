<script setup lang="ts">
import NotifComponent from "@/components/NotifComponent.vue";
import { ref } from "vue";

const showNotif = ref(false);
const notifMessage = ref("");

const copyToClip = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error(err);
    notifMessage.value = "Could not copy to clipboard.";
    showNotif.value = true;

    return;
  }

  notifMessage.value = "Contact copied to clipboard.";
  showNotif.value = true;
};
</script>

<template>
  <main>
    <NotifComponent
      :message="notifMessage"
      :shown="showNotif"
      @close="showNotif = false"
    ></NotifComponent>

    <div class="contacts">
      <div class="element">
        <div class="info-link">
          <a href="https://t.me/dstuden">
            <font-awesome-icon class="icon" icon="fa-brands fa-telegram" />
          </a>
        </div>
        <p>@dstuden</p>
      </div>
      <div
        class="element"
        @click="
          () => {
            copyToClip('David&\#5419');
          }
        "
      >
        <div class="info-link">
          <font-awesome-icon class="icon" icon="fa-brands fa-discord" />
        </div>
        <p>David&&#35;5419</p>
      </div>
      <div
        class="element"
        @click="
          () => {
            copyToClip('studen.david@gmail.com');
          }
        "
      >
        <div class="info-link">
          <font-awesome-icon class="icon" icon="fa-solid fa-envelope" />
        </div>
        <p>studen.david@gmail.com</p>
      </div>
      <div class="element">
        <div class="info-link">
          <a href="https://github.com/dstuden">
            <font-awesome-icon class="icon" icon="fa-brands fa-github" />
          </a>
        </div>
        <p>@dstuden</p>
      </div>
    </div>
  </main>
</template>

<style lang="less" scoped>
main {
  .contacts {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    row-gap: 32px;

    .element {
      display: flex;
      flex-direction: row;
      place-items: center;
      column-gap: 32px;
      max-width: 100%;
      word-break: break-all;

      @media screen and (max-width: 300px) {
        p {
          display: none;
        }
      }

      .info-link {
        a {
          color: unset;
          height: 40px;
          width: 40px;

          @media screen and (max-width: 800px) {
            height: 30px;
            width: 30px;
          }
        }
      }
    }
  }
}
</style>
