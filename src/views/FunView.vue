<script setup lang="ts">
import JJK from "@/assets/Images/JJK.webp";
import Kaguya from "@/assets/Images/Kaguya.webp";
import Jojo from "@/assets/Images/JoJo.webp";
import MrRobot from "@/assets/Images/MrRobot.webp";
</script>

<template>
  <main>
    <ul>
      <li>
        <h3>Favorite shows, manga, etc.</h3>
        <ul>
          <li>
            <img :src="JJK" class="media" /><a
              href="https://anilist.co/manga/101517/Jujutsu-Kaisen/"
              >JuJutsu Kaisen</a
            >
          </li>
          <li>
            <img :src="Kaguya" class="media" /><a
              href="https://anilist.co/manga/86635/Kaguyasama-Love-is-War/"
              >Kaguya-sama: Love is War</a
            >
          </li>
          <li>
            <img :src="Jojo" class="media" /><a
              href="https://anilist.co/manga/31706/JoJo-no-Kimyou-na-Bouken-Steel-Ball-Run/"
              >JoJo no Kimyou na Bouken</a
            >
          </li>
          <li>
            <img :src="MrRobot" class="media" /><a
              href="https://www.imdb.com/title/tt4158110/"
              >Mr. Robot</a
            >
          </li>
          <li>
            <a href="https://anilist.co/user/Soulyzero/"
              >Other series I have watched and/or read</a
            >
          </li>
        </ul>
      </li>
      <li>
        <h3>Favorite videogames</h3>
        <ul>
          <li>
            <p>
              <a href="https://www.terraria.org/">Terraria</a> - 10/10 (the only
              game with serious replay value; change my mind)
            </p>
          </li>
        </ul>
      </li>
      <li>
        <h3>Favorite music</h3>
        <ul>
          <li>
            My music taste is wild and you probably won't agree with how I rate
            music
          </li>
        </ul>
      </li>
    </ul>
  </main>
</template>

<style lang="less" scoped>
@import "@/assets/main.less";

ul > li > ul > li::before {
  content: "";
  min-width: 6px;
  min-height: 6px;
  display: inline-block;
  background-color: @primary;
  border-radius: 100%;
  place-self: center;
}

ul > li > ul > li {
  display: flex;
  flex-direction: row;
  column-gap: 15px;
  align-items: center;
}

.media {
  width: 100px;
}
</style>
