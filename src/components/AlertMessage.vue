<script setup lang="ts">
import { Transition } from 'vue'

type MessageLevels = 'info' | 'warn' | 'ok' | 'error'
const props = defineProps<{
  message: string
  level: MessageLevels
  visible: boolean
  dimBackground?: boolean
}>()
</script>

<template>
  <Teleport to="body">
    <Transition>
      <div class="alertContainer" :class="{ dim: dimBackground && visible }">
        <div class="alert" :class="level" v-if="visible">
          <span>{{ props.message }}</span>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
.alertContainer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;

  transition: 150ms;
  background: transparent;

  &.dim {
    background: rgba($color: black, $alpha: 0.3);
  }
  z-index: 999;
}

.alert {
  padding: $pad;
  border: $borderWeight solid transparent;
  border-radius: $br;

  position: fixed;
  bottom: $pad * 2;
  left: 50%;
  width: fit-content;

  @include ms-depth(16);

  // box-sizing: border-box;
  max-width: calc($maxWidth - $pad * 2);
  color: white;

  z-index: 1000;

  &.info {
    background: $blue;
    // border: $blue;
  }
  &.warn {
    background: $orange;
    // border-color: $lightOrange;
  }
  &.ok {
    background: $green;
    // border-color: $green;
  }
  &.error {
    background: $red;
    // border-color: $red;
  }

  transform: translate(-50%, 0);
}

.v-enter-active,
.v-leave-active {
  .alert {
    transition: transform 100ms;
  }
}

.v-enter-from,
.v-leave-to {
  .alert {
    transform: translate(-50%, calc(100% + $pad * 2));
  }
}
</style>
