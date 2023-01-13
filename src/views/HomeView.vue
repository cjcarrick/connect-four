<script setup lang="ts">
import { inject, ref } from 'vue'
import { useRouter } from 'vue-router'

const userId = ref('')
const gameId = ref<undefined | string>(undefined)
const teamId = ref<undefined | string>(undefined)

const socket: undefined | WebSocket = inject('socket')
const ready = ref(socket?.readyState == 1)
if (socket) {
  socket.addEventListener('open', () => (ready.value = true))
}

const router = useRouter()
const matchmake = () =>
  userId.value &&
  router.push({
    path: '/matchmake',
    query: { userId: userId.value, teamId: teamId.value, gameId: gameId.value }
  })
</script>

<template>
  <div class="container">
    <template v-if="ready">
      <input
        type="text"
        v-model="userId"
        @keydown.enter="matchmake"
        placeholder="User ID"
      />
      <input
        type="text"
        v-model="gameId"
        @keydown.enter="matchmake"
        placeholder="Game ID (optional)"
      />

      <select v-model="teamId">
        <option :value="undefined">Team (optional)</option>
        <option :value="0">Red Team</option>
        <option :value="1">Yellow Team</option>
      </select>

      <button class="button" :disabled="!userId" @click="matchmake">
        Matchmake
      </button>
    </template>

    <router-link class="button" to="/local">Play Locally</router-link>
    <router-link class="button" to="/cpu">Play vs CPU</router-link>
  </div>
</template>

<style lang="scss" scoped>
.container {
  display: flex;
  width: 20rem;
  max-width: 100%;
  flex-direction: column;
  align-items: stretch;
  gap: $gap;
  margin: 0 auto;
}
.button + .button {
  margin-top: 0.5em;
}

select,
.button,
input {
  padding: $pad;
  border-radius: $br;
  font-style: normal;
  outline: none;
}

select,
input {
  border: 1px solid rgba(0, 0, 0, 20%);
  background: white;
}

.button {
  background-color: $blue;
  color: white;
  border: none;
  text-align: center;
  font-weight: bold;
  font-size: 0.85rem;

  &:hover {
    text-decoration: none;
  }

  &:not(:disabled) {
    cursor: pointer;
  }

  &:disabled {
    opacity: 0.2;
  }
}
</style>
