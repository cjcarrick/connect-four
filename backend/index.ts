import express from 'express'
import http from 'http'
import path from 'path'
import { fileURLToPath } from 'url'
import { WebSocketServer } from 'ws'
import { decodeMessage, encodeMessage } from '../lib/ws'
import { env } from './env'
import MatchList from './matchList'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const matchList = new MatchList()
const app = express()
const server = http.createServer(app)
const wss = new WebSocketServer({ server })

wss.on('connection', ws => {
  ws.on('message', (message: string) => {
    const msg = decodeMessage(message)

    if (msg.type == 'RequestJoinGame') {
      const match = matchList.matchmake(msg.userId, msg.gameId, msg.teamId)

      if (match) {
        ws.send(encodeMessage(match))
      } else {
        console.error('Could not match', msg)
      }
    } else if (msg.type == 'LeaveMatch') {
      const game = matchList.games[msg.gameId]

      if (!game) {
        ws.send(encodeMessage({ type: 'Error', detail: 'Game not found' }))
        console.warn('game with gameId', msg.gameId, 'not found')
        return
      }

      game.removePlayer(msg.teamId, msg.userId)

      // Remove this game from the list if no one is in it anymore
      if (
        game.players.teams.reduce((prev, curr) => prev + curr.length, 0) == 0
      ) {
        matchList.games.splice(game.gameId, 1)
      }
    } else if (msg.type == 'MatchedGame') {
      // Fetch game details and add player to the agme
      const game = matchList.games[msg.gameId]
      if (!game) {
        ws.send(encodeMessage({ type: 'Error', detail: 'Game not found' }))
        console.warn('game with gameId', msg.gameId, 'not found')
        return
      }

      game.addToTeam(msg.userId, msg.teamId)

      // Send initial data
      ws.send(encodeMessage(game.board))
      ws.send(encodeMessage(game.players))
      ws.send(encodeMessage(game.winner))
      ws.send(encodeMessage(game.turn))

      // Subscribe to changes
      game.on('BoardData', () => ws.send(encodeMessage(game.board)))
      game.on('PlayersData', () => ws.send(encodeMessage(game.players)))
      game.on('WinnerData', () => ws.send(encodeMessage(game.winner)))
      game.on('TurnData', () => ws.send(encodeMessage(game.turn)))

      // Remove player from game if they disconnect
      ws.on('close', () => {
        game.removePlayer(msg.teamId, msg.userId)

        if (
          game.players.teams.reduce((prev, curr) => prev + curr.length, 0) == 0
        ) {
          delete matchList.games[game.gameId]
        }
      })
    } else if (msg.type == 'RequestPlacePiece') {
      matchList.games[msg.gameId].placePiece(msg.teamId, msg.x, msg.y)
    } else {
      console.warn('unknown message type')
    }
  })
})

// Only serve index.html in production.
// In development, a dev server is provided by vite
if (env.NODE_ENV?.match(/prod/i)) {
  app.use(express.static(path.join(__dirname, '../../dist')))
}

// Always serve the base server since it does the websocket
server.listen(env.PORT || 3000)
console.log(`listening at *:${env.PORT || 3000}`)
