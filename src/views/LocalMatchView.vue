<script setup lang="ts">
import confetti from 'canvas-confetti'
import Match from 'lib/match'
import { teamName } from 'lib/util'
import AlertMessage from 'src/components/AlertMessage.vue'
import { ref, watch } from 'vue'
import PlayerList from '../components/PlayerList.vue'
import TheBoard from '../components/TheBoard.vue'

// Create a match
const match = new Match(0, undefined, undefined, undefined)

const turn = ref(match.turn.turn)
const winner = ref(match.winner.teamId)
const pieces = ref(match.board.pieces)

const update = () => {
  turn.value = match.turn.turn
  winner.value = match.winner.teamId
  pieces.value = match.board.pieces
}
match.on('WinnerData', update)
match.on('BoardData', update)
match.on('TurnData', update)

// Put 1 player on each team in that match
match.addToTeam('Player 1', 0)
match.addToTeam('Player 2', 1)

// Shoot out confetti when somebody wins
watch(winner, (newVal, oldVal) => {
  if (newVal !== null && oldVal == null) {
    confetti({ origin: { y: 1 }, zIndex: 50 })
  }
})

function placePiece(column: number, row: number) {
  match.placePiece(match.turn.turn, column, row)
}
</script>

<template>
  <TheBoard
    :board="{
      pieces: pieces,
      rows: match.board.rows,
      columns: match.board.columns,
      type: 'BoardData'
    }"
    :turn="turn"
    :team-id="turn"
    :winner="winner"
    @place="placePiece"
  />

  <PlayerList
    :teams="{
      type: 'PlayersData',
      teams: [['Player 1'], ['Player 2']]
    }"
    :turn="turn"
  />

  <AlertMessage
    :visible="winner !== null"
    :message="(winner == null ? '' : teamName(winner)) + ' team wins!'"
    :dim-background="true"
    level="ok"
  />
</template>
