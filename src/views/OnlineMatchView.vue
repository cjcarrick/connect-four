<script setup lang="ts">
import confetti from 'canvas-confetti'
import {
  decodeMessage,
  encodeMessage,
  type BoardData,
  type PlayersData,
  type SelfData,
  type TurnData,
  type WinnerData
} from 'lib/ws'
import AlertMessage from 'src/components/AlertMessage.vue'
import PlayerList from 'src/components/PlayerList.vue'
import TheBoard from 'src/components/TheBoard.vue'
import { inject, ref, watch } from 'vue'
import { onBeforeRouteLeave, onBeforeRouteUpdate, useRoute } from 'vue-router'

const error = ref('')

const socket: WebSocket | undefined = inject('socket')
const route = useRoute()
if (!socket) throw new Error('No socket')

const gameId = parseInt(route.params.gameId.toString(), 10)
const teamId = parseInt(route.params.teamId.toString(), 10)
const userId = route.params.userId.toString()

const teams = ref<undefined | PlayersData>(undefined)
const board = ref<undefined | BoardData>(undefined)
const turn = ref<undefined | TurnData>(undefined)
const self = ref<SelfData>({ type: 'SelfData', gameId, teamId, userId })
const winner = ref<WinnerData>({ teamId: null, type: 'WinnerData' })

// Shoot out confetti when somebody wins
watch(winner, (newVal, oldVal) => {
  if (newVal.teamId == self.value.teamId && oldVal.teamId == null) {
    confetti({ origin: { y: 1 }, zIndex: 50 })
  }
})

// Get ready to take messagees from the server
socket.addEventListener('message', message => {
  const msg = decodeMessage(message.data)
  if (msg.type == 'BoardData') {
    board.value = msg
  } else if (msg.type == 'WinnerData') {
    winner.value = msg
  } else if (msg.type == 'TurnData') {
    turn.value = msg
  } else if (msg.type == 'PlayersData') {
    teams.value = msg
  } else if (msg.type == 'Error') {
    error.value = 'Game not found. Please try again.'
  }
})

// Let the server know we made it into the match ok, and we want our first batch
// of data

if (socket.readyState == 1) {
  socket.send(encodeMessage({ type: 'MatchedGame', teamId, userId, gameId }))
} else {
  socket.addEventListener('open', () => {
    socket.send(encodeMessage({ type: 'MatchedGame', teamId, userId, gameId }))
  })
}

// Let the server know when we leave
onBeforeRouteLeave(() => {
  socket.send(encodeMessage({ type: 'LeaveMatch', teamId, userId, gameId }))
})

function placePiece(column: number, row: number) {
  if (socket) {
    if (self.value) {
      socket.send(
        encodeMessage({
          type: 'RequestPlacePiece',
          teamId: self.value.teamId,
          userId: self.value.userId,
          gameId: self.value.gameId,
          x: column,
          y: row
        })
      )
    } else {
      console.error('self metadataa unavalible')
    }
  } else {
    console.error('socket unreachable')
  }
}
</script>

<template>
  <template v-if="error">
    <p class="center">{{ error }}</p>
  </template>

  <template v-else-if="teams && board && turn && winner && self">
    <TheBoard
      v-if="turn && winner && self"
      :board="board"
      :turn="turn.turn"
      :team-id="self.teamId"
      :winner="winner.teamId"
      @place="placePiece"
    />

    <PlayerList :teams="teams" :self="{ userId, teamId }" :turn="turn.turn" />

    <AlertMessage
      :visible="winner.teamId !== null"
      :message="winner.teamId == self.teamId ? 'You win!' : 'You lose!'"
      :level="winner.teamId == self.teamId ? 'ok' : 'error'"
      :dim-background="true"
    />
  </template>
</template>

<!-- 
At least an empty style block is required for the index.scss to be appended.
It can't be scoped, because the index.scss inludes styles that are applied to the body element.
-->
<style lang="scss">
//
</style>

<style scoped lang="scss">
.stack {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $pad;
}

.center {
  text-align: center;
}
</style>
