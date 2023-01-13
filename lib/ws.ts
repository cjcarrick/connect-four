// Matchmaking process:

// 1: Client sends this request to find a game

type RequestJoinGame = {
  type: 'RequestJoinGame'
  /** leave undefined to be put in a random game */
  gameId?: number | undefined
  /** leave undefined to be put on a random team */
  teamId?: number
  userId: string
}

// 2: server responds with this

export type MatchedGame = {
  type: 'MatchedGame'
  gameId: number
  teamId: number
  userId: string
}

// 3: Client sends data back MatchedGame to actually be put on the team

// 4: Client is now ready to recieve all kinds of other stuff:

export type WinnerData = {
  type: 'WinnerData'
  teamId: number | null
}

export type BoardData = {
  type: 'BoardData'
  pieces: (null | number)[][]
  rows: number
  columns: number
}

export type PlayersData = {
  type: 'PlayersData'
  teams: [string[], string[]]
}

export type SelfData = {
  type: 'SelfData'
  userId: string
  gameId: number
  teamId: number
}

export type TurnData = {
  type: 'TurnData'
  turn: number
}

export type RequestPlacePiece = {
  type: 'RequestPlacePiece'
  userId: string
  gameId: number
  teamId: number
  x: number
  y: number
}

export type GameNotFoundError = {
  type: 'Error'
  detail: 'Game not found'
}

export type LeaveMatch = {
  type: 'LeaveMatch'
  gameId: number
  teamId: number
  userId: string
}

export type WebSocketMessage =
  | GameNotFoundError
  | LeaveMatch
  | RequestJoinGame
  | SelfData
  | PlayersData
  | TurnData
  | BoardData
  | WinnerData
  | MatchedGame
  | RequestPlacePiece

// For now, messages are stored as JSON strings. I'm sure they could be
// converted to buffers instead for higher efficiency, but this works fine for
// now.

export function decodeMessage(message: string) {
  return JSON.parse(message) as WebSocketMessage
}

export function encodeMessage(message: WebSocketMessage) {
  return JSON.stringify(message)
}
