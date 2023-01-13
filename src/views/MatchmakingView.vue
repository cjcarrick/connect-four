<script setup lang="ts">
import { decodeMessage, encodeMessage } from 'lib/ws'
import { inject, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const failed = ref(false)
const router = useRouter()

try {
  // Make sure socket is avalible

  const socket: WebSocket | undefined = inject('socket')

  if (!socket) {
    throw new Error('socket is undefined')
  } else if (socket.readyState == 2) {
    throw new Error('socket is closing')
  } else if (socket.readyState == 3) {
    throw new Error('socket is closed')
  }

  // Validate query

  const gameIdQuery = useRoute().query.gameId?.toString()
  const gameId = gameIdQuery ? parseInt(gameIdQuery) : undefined

  const teamIdQuery = useRoute().query.teamId?.toString()
  const teamId = teamIdQuery ? parseInt(teamIdQuery) : undefined

  const userId = useRoute().query.userId?.toString()
  if (!userId) {
    throw new Error('Missing userId in query')
  }

  // Send request to server

  if (socket.readyState == 1) {
    socket.send(
      encodeMessage({ type: 'RequestJoinGame', gameId, teamId, userId })
    )
  } else {
    socket.addEventListener('open', () =>
      socket.send(
        encodeMessage({ type: 'RequestJoinGame', gameId, teamId, userId })
      )
    )
  }

  // When we find a match, open it in /online
  socket.addEventListener('message', message => {
    const msg = decodeMessage(message.data)
    if (msg.type == 'MatchedGame') {
      router.push(`/online/${msg.gameId}/${msg.teamId}/${msg.userId}`)
    }
  })
} catch (e) {
  console.error(e)
  failed.value = true
}
</script>

<template>
  <template v-if="failed">
    <p class="center">Unable to find a match.</p>
  </template>

  <template v-else>
    <img src="/src/assets/pieces-01.svg" class="img" />
  </template>
</template>

<style scoped lang="scss">
.center {
  text-align: center;
  color: white;
}

.img {
  animation: spin 1s infinite linear;
  width: 2rem;
  height: 2rem;
  margin-top: 2rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
