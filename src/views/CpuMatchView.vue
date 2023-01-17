<script setup lang="ts">
import confetti from 'canvas-confetti'
import Match from 'lib/match'
import { shuffleArray } from 'lib/util'
import AlertMessage from 'src/components/AlertMessage.vue'
import { ref, watch } from 'vue'
import PlayerList from '../components/PlayerList.vue'
import TheBoard from '../components/TheBoard.vue'

// Create a match
const match = new Match(0, undefined, undefined, undefined)

const turn = ref(match.turn.turn)
const winner = ref(match.winner.teamId)
const pieces = ref(match.board.pieces)

// Put 1 player on each team in that match
match.addToTeam('Player 1', 0)
match.addToTeam('CPU', 1)

const update = () => {
  turn.value = match.turn.turn
  winner.value = match.winner.teamId
  pieces.value = match.board.pieces
}

watch(turn, (oldValue, newValue) => {
  if (oldValue == 1 && newValue == 0) {
    setTimeout(
      () => winner.value == null && cpuPlacePiece(),
      250 + Math.random() * 500
    )
  }
})

// Shoot out confetti when somebody wins
watch(winner, (newVal, oldVal) => {
  if (newVal == 0 && oldVal == null) {
    confetti({ origin: { y: 1 }, zIndex: 50 })
  }
  if (newVal == null && oldVal == 0) {
    cpuPlacePiece()
  }
})

// Randomly choose a place to put a piece
function cpuPlacePiece() {
  // Randomly search through each column
  const randomOrder = shuffleArray([...new Array(match.board.columns).keys()])

  // Find a space in that column to place a piece
  for (let i = 0, len = randomOrder.length; i < len; i++) {
    const x = randomOrder[i]

    const piecesInThisColumn = [...pieces.value[x]]
    for (let y = piecesInThisColumn.length - 1; y > -1; y--) {
      const player = piecesInThisColumn[y]
      if (player == null) {
        placePiece(x, y)
        return
      }
    }
  }

  console.error('nowhere to place piece')
}

match.on('WinnerData', update)
match.on('BoardData', update)
match.on('TurnData', update)

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
    :team-id="0"
    :winner="winner"
    @place="placePiece"
  />

  <PlayerList
    :teams="{
      type: 'PlayersData',
      teams: [['Player 1'], ['CPU']]
    }"
    :turn="turn"
  />

  <AlertMessage
    :visible="winner !== null"
    :message="winner == 1 ? 'You lose!' : 'You win!'"
    :level="winner == 1 ? 'error' : 'ok'"
    :dim-background="true"
  />
</template>
