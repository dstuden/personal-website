<script setup>
import WelcomeMessage from './components/WelcomeMessage.vue'
import InfoPanel from './components/InfoPanel.vue'
</script>

<template>
  <main>
    <div class="title">
      <WelcomeMessage msg="David Studen" />
    </div>

    <div class="other">
      <img alt="logo" class="logo" src="./assets/logo.svg" />
    </div>
  </main>
  <div class="info">
    <InfoPanel title="About Me" class="aboutMe">
      <template #content>
        <p>I'm 17 years old and a third year currently studying at <a href="https://www.vegova.si/">Vegova</a>.</p>
        <br>
        <p>I enjoy programming and learning new technologies.</p>
        <br>
        <p>I spend most of my free time fixing and improving my Arch Linux installation.</p>
      </template>
    </InfoPanel>

    <InfoPanel title="Skills" class="skills">
      <template #content>
        <ul>
          <li>C++</li>
          <li>JavaScript, HTML, CSS</li>
          <li>Node JS</li>
          <li>JS frameworks (Express, Vue, Svelte)</li>
          <li>Linux/UNIX administration</li>
          <li>SQL</li>
        </ul>
      </template>
    </InfoPanel>

    <InfoPanel title="Projects" class="projects">
      <template #content>
        <ul>
          <li><a href="https://github.com/dstuden/Worker-Bot">Discord bot</a></li>
          <li><a href="https://github.com/dstuden/HopKing">C++/SDL game</a></li>
          <li><a href="https://github.com/dstuden/privsek-pulse">joke/learning svelte project</a></li>
        </ul>
      </template>
    </InfoPanel>

    <InfoPanel title="Contact" class="contact">
      <template #content>
        <div class="iconData">
          <img alt="emailicon" src="./components/icons/email.svg" />
          <h4>studen.david@gmail.com</h4>
        </div>
        <div class="iconData">
          <img alt="discordicon" src="./components/icons/discord.svg" />
          <h4><a href="https://discordapp.com/users/971823437251248149">David&</a></h4>
        </div>
        <div class="iconData">
          <img alt="discordicon" src="./components/icons/github.svg" />
          <h4><a href="https://github.com/dstuden/">Dstuden</a></h4>
        </div>
      </template>
    </InfoPanel>
    <div></div>
  </div>

  <footer>
    <i>Insert generic "made with Love" message</i>
  </footer>
</template>

<style>
@import './assets/base.css';

html,
body,
#app {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  background: var(--background);
}

a {
  color: var(--links);
  text-decoration: none;
}

#app {
  font-weight: normal;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  display: flex;
  flex-direction: column;
  padding-top: 20vh;
}

.title {
  line-height: 1.5;
}

.iconData {
  display: flex;
  flex-direction: row;
  gap: 1em;
  line-height: 3em;
  place-items: center;
}

.other {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 5vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
  width: 30vh;
}

main {
  padding-bottom: 20vh;
}

.info {
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 5vh;
  padding: 2em;
}

ul {
  line-height: 2em;
}

footer {
  margin: 0;
  width: 100%;
  background: var(--white);
  line-height: 1.5em;
  text-align: center;
  font-weight: 300;
}

@media (min-width: 1024px) {
  body {
    display: flex;
    place-items: center;
  }

  main {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 0 2rem;
    gap: 5em;
    padding-bottom: 20vh;
  }

  .info {
    display: grid;
    grid-template-areas:
      'about skills'
      'about skills'
      'projects skills'
      'projects skills'
      'projects contact'
      'projects contact'
    ;
    column-gap: 8vw;
    row-gap: 10em;
    place-content: center;
    padding: 0;
  }

  .title {
    display: flex;
    place-items: center;
    padding-left: 15vw;
  }

  .mainInfo {
    padding-top: 0;
    padding-left: 5em;
  }

  .logo {
    margin: 0 2rem 0 0;
    width: 40vh;
  }


  .aboutMe {
    grid-area: about;
    max-width: 30em;
  }

  .contact {
    grid-area: contact;
    max-width: 30em;
  }

  .skills {
    grid-area: skills;
    max-width: 30em;
  }

  .projects {
    grid-area: projects;
    max-width: 30em;
  }
}

::-webkit-scrollbar {
  width: 0.5em;
  background: var(--background-secondary);
}

::-webkit-scrollbar-thumb {
  background: var(--foreground-secondary);
  border-radius: 1em;
}
</style>
