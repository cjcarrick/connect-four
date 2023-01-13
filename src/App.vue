<script setup lang="ts">
import HeaderLogo from './components/HeaderLogo.vue'
</script>

<template>
  <div class="stack">
    <!-- Having the header here allows a smooth transition when the min class is added or removed -->
    <router-link to="/connect-four" class="home-button">
      <HeaderLogo :class="{ min: $route.name !== 'home' }" />
    </router-link>

    <router-view />

    <a
      href="https://www.github.com/cjcarrick/connect-four"
      class="link"
      v-if="$route.path == '/connect-four'"
    >
      Source
    </a>
  </div>
</template>

<!-- 
At least an empty style block is required for the index.scss to be appended.
It can't be scoped, because the index.scss inludes styles that are applied to the body element.
-->
<style lang="scss">
.stack {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $pad;
}

.home-button {
  font-style: normal;

  &:hover {
    text-decoration: none;
  }
}

.link {
  text-decoration: underline;
  color: white;
}
</style>
