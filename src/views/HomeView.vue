<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const welcomeMessage = ref("");
const welcomeCharacters = [
  "H",
  "e",
  "l",
  "l",
  "o",
  " ",
  "t",
  "h",
  "e",
  "r",
  "e",
  "!",
];

onMounted(() => {
  let count = 0;

  const type = setInterval(() => {
    if (count >= welcomeCharacters.length - 1) clearInterval(type);

    welcomeMessage.value += welcomeCharacters[count];
    count++;
  }, 140);
  if (count >= welcomeCharacters.length) clearInterval(type);
});

const redirect = (routeName: string) => {
  router.push({ name: routeName });
};
</script>

<template>
  <main>
    <div class="circle-list">
      <div class="top">
        <div class="element experience" @click="redirect('experience')">
          <div class="info-link">
            <font-awesome-icon class="icon" icon="fa-solid fa-suitcase" />
          </div>
        </div>

        <div class="element fun" @click="redirect('fun')">
          <div class="info-link">
            <font-awesome-icon class="icon" icon="fa-solid fa-gamepad" />
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="element skills" @click="redirect('skills')">
          <div class="info-link">
            <font-awesome-icon class="icon" icon="fa-solid fa-code" />
          </div>
        </div>
        <div class="element contact" @click="redirect('contact')">
          <div class="info-link">
            <font-awesome-icon class="icon" icon="fa-solid fa-address-card" />
          </div>
        </div>
        <div class="element projects" @click="redirect('projects')">
          <div class="info-link">
            <font-awesome-icon class="icon" icon="fa-solid fa-list-check" />
          </div>
        </div>
      </div>
    </div>
    <h3 class="title">{{ welcomeMessage }}</h3>
  </main>
</template>

<style lang="less" scoped>
@import "@/assets/main.less";

main {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media screen and (min-width: 800px) {
    .circle-list {
      position: static;

      .element {
        display: block;
        position: fixed;

        .info-link {
          width: 100px !important;
          height: 100px !important;

          .icon {
            width: 40px !important;
            height: 40px !important;
          }
        }
      }

      .experience {
        top: 10%;
        left: 10%;
      }

      .fun {
        top: 20%;
        right: 20%;
      }

      .school {
        bottom: 15%;
        left: 20%;
      }

      .skills {
        bottom: 10%;
        right: 10%;
      }

      .contact {
        bottom: 10%;
        left: 25%;
      }

      .projects {
        top: 10%;
        left: 50%;
      }
    }
    .title {
      font-size: 96px !important;
    }
  }

  .circle-list {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    justify-content: space-between;

    .top,
    .bottom {
      display: flex;
      flex-direction: row;
      width: 100%;
      justify-content: space-between;
    }

    .top {
      .experience,
      .fun {
        margin-top: 50px;
      }
    }

    .bottom {
      align-items: flex-end;
      .skills,
      .projects {
        padding-bottom: 50px;
      }
    }
  }
  .title {
    position: absolute;
    font-size: 64px;
    font-weight: 600;
    text-align: center;
    padding: 0 20px;
  }
}
</style>
