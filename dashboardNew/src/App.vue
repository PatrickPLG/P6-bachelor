
<script setup>

import {onBeforeMount} from "vue";
import {useColors} from "vuestic-ui";


onBeforeMount(() => {
  const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  useColors().applyPreset(darkMode ? 'dark' : 'light')
})

</script>
<template>
  <RouterView />
</template>

<style lang="scss">
@import 'scss/main.scss';

#app {
  font-family: 'Inter', Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
  min-width: 20rem;
}
</style>
