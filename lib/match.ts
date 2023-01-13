import {
  BoardData,
  PlayersData,
  TurnData,
  WebSocketMessage,
  WinnerData
} from './ws'

type MatchEvent = WebSocketMessage['type']

export default class Match {
  players: PlayersData
  board: BoardData

  /** the team id of the team that won.
   *
   * This is set immediately after a win is detected, and is unset a short time after.
   *
   * Null if there is no current winner.
   */
  winner: WinnerData
  turn: TurnData
  private listeners: { [eventName in MatchEvent]: (() => void)[] }

  constructor(
    public gameId: number,
    private rows = 6,
    private columns = 8,

    /** how many pieces a player has to get in a row in order to win.
     * In connect 4, this is 4. */
    private sequentialNeeded = 4
  ) {
    // Initialize blank board
    this.board = {
      type: 'BoardData',
      rows,
      columns,
      pieces: new Array(columns).fill(0).map(() => new Array(rows).fill(null))
    }
    this.winner = { type: 'WinnerData', teamId: null }
    this.players = { type: 'PlayersData', teams: [[], []] }
    this.turn = { type: 'TurnData', turn: 0 }
    this.listeners = {
      LeaveMatch: [],
      Error: [],
      RequestJoinGame: [],
      MatchedGame: [],
      SelfData: [],
      PlayersData: [],
      TurnData: [],
      BoardData: [],
      WinnerData: [],
      RequestPlacePiece: []
    }
  }

  private emit = (event: MatchEvent) => {
    for (let i = 0; i < this.listeners[event].length; i++) {
      this.listeners[event][i]()
    }
  }
  public on = (event: MatchEvent, callback: () => void) => {
    if (!(event in this.listeners)) {
      this.listeners[event] = []
    }
    this.listeners[event].push(callback)
  }

  private advanceTurn = () => {
    this.turn.turn = (this.turn.turn + 1) % this.players.teams.length
    this.emit('TurnData')
  }

  private checkWin = (sequentialNeeded = this.sequentialNeeded) => {
    let { rows, columns } = this
    let HEIGHT = columns
    let WIDTH = rows
    let board = this.board.pieces

    for (let r = 0; r < HEIGHT; r++) {
      // iterate rows, bottom to top
      for (let c = 0; c < WIDTH; c++) {
        // iterate columns, left to right
        let player = board[r][c]
        if (player == null) continue // don't check empty slots

        if (
          c + sequentialNeeded - 1 < WIDTH &&
          [...Array(sequentialNeeded - 1).keys()].every(
            a => player == board[r][c + a + 1]
          )
        )
          return player
        if (r + sequentialNeeded - 1 < HEIGHT) {
          if (
            [...Array(sequentialNeeded - 1).keys()].every(
              a => player == board[r + 1 + a][c]
            )
          )
            return player
          if (
            c + 3 < WIDTH &&
            [...Array(sequentialNeeded - 1).keys()].every(
              a => player == board[r + 1 + a][c + 1 + a]
            )
          )
            return player
          if (
            c - 3 >= 0 &&
            [...Array(sequentialNeeded - 1).keys()].every(
              a => player == board[r + 1 + a][c - 1 - a]
            )
          )
            return player
        }
      }
    }
    return null
  }

  placePiece = (teamId: number, x: number, y: number) => {
    // Make sure this person is allowed to place a piece
    if (this.turn.turn !== teamId) {
      console.log('Not your turn')
      return
    }

    if (this.board.pieces[x][y] !== null) {
      console.log('Piece already placed')
      return
    }

    // Add a piece to the board
    this.board.pieces[x][y] = teamId

    // Set the turn to the next team
    this.advanceTurn()

    // Let everone in the game know about the new board
    this.emit('BoardData')

    const winner = this.checkWin()
    if (winner !== null) {
      this.winner.teamId = teamId
      this.emit('WinnerData')

      // Give everyone a second to realize they lost
      setTimeout(() => {
        this.board.pieces = new Array(this.columns)
          .fill(0)
          .map(() => new Array(this.rows).fill(null))
        this.winner.teamId = null

        this.emit('BoardData')
        this.emit('WinnerData')
      }, 4500)
    }
  }

  /** returns the teamId that a new player should be added to */
  pickTeam = () => {
    return this.players.teams[1].length > this.players.teams[0].length ? 0 : 1
  }

  /** returns true if someone should be added to this game
   *
   * Optionally specify a userId to make sure that no one in this game has that
   * name already. */
  needSomeone = (userId?: string) => {
    if (this.players.teams[0].length + this.players.teams[1].length <= 1) {
      if (userId) {
        return !this.players.teams.find(t => t.find(p => p == userId))
      }
      return true
    }
    return false
  }

  /** adds a player to a team. If a player with this userId is already on the
   * team, does nothing. */
  addToTeam = (userId: string, teamId: number) => {
    if (!this.players.teams[teamId].find(a => a == userId)) {
      this.players.teams[teamId].push(userId)
      this.emit('PlayersData')
    }
  }

  /** teamId is required because people on the same team can have the same name */
  removePlayer = (teamId: number, userId: string) => {
    const i = this.players.teams[teamId].indexOf(userId)
    if (i > -1) {
      this.players.teams[teamId].splice(i, 1)
      this.emit('PlayersData')
    }
  }
}
