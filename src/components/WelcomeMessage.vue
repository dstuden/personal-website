<script setup>
defineProps({
  msg: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="greetings">
    <h1 class="message">{{ msg }}</h1>
    <h3>
      I'm a software developer from Slovenia.
    </h3>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
  color: var(--foreground-secondary);
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

.message {
  font-size: 4.5rem;
  color: var(--foreground)
}

@media (min-width: 1024px) {

  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
