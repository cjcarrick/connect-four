import Match from '../lib/match'
import { MatchedGame } from '../lib/ws'

export default class MatchList {
  games: Match[]

  constructor() {
    this.games = []
  }

  /** Determine what team a player should be put on.
   *
   * If a gameId is specified, only pick a team from that game
   *
   * Otherwise, look through all games to find the best match.
   *
   * If no matches are found, returns false
   */
  private findATeam: (
    gameId?: number,
    userId?: string
  ) => { gameId: number; teamId: number } | false = (
    gameId?: number,
    userId?: string
  ) => {
      if (this.games.length == 0) {
        return false
      }

      // Recommend the team that has the least amount of players
      // TODO: Improve this to allow searching through more than just 2 teams, in
      // case multi-team modes are ever added

      if (gameId !== undefined) {
        const teamId = this.games[gameId].pickTeam()
        return { teamId, gameId }
      }

      // Find game that needs one player

      const weNeedYou = this.games.find(a => a?.needSomeone(userId))
      if (weNeedYou) {
        return this.findATeam(weNeedYou.gameId)
      }

      // Find the team with the least amount of players

      const least = [...this.games]
        .filter(a =>
          userId ? a.players.teams.find(t => t.find(p => p == userId)) : true
        )
        .sort(
          (a, b) =>
            b.players[0].length +
            b.players[1].length -
            a.players[0].length -
            b.players[1].length
        )[0]

      if (least) {
        return this.findATeam(least.gameId)
      }

      return false
    }

  /** adds a player to a team, and lets everyone in the game know about the new
   * teams */
  private addToTeam = (userId: string, teamId: number, gameId: number) => {
    if (!(gameId in this.games)) {
      console.warn(
        `attempted to add user ${userId} to game ${gameId}, but game ${gameId} does not exist`
      )
      console.log(this.games, gameId)
      // this.games[gameId].addToTeam(player)
    }
    this.games[gameId].addToTeam(userId, teamId)
  }

  private addNewGame = () => {
    const match = new Match(this.games.length)
    this.games.push(match)
    return match.gameId
  }

  /** find a and a team for a player, and put them on that team. This will
   * silently fail if something goes wrong. */
  matchmake = (userId: string, gameId?: number, teamId?: number) => {
    let response: MatchedGame

    // Attempt to put the player in the requested game
    if (gameId !== undefined) {
      if (this.games[gameId]) {
        const team = this.findATeam(gameId)

        if (team) {
          response = {
            type: 'MatchedGame',
            teamId: teamId == undefined ? team.teamId : teamId,
            gameId: team.gameId,
            userId
          }
          return response
        }
      }

      // Create a new game if this id doesn't exist yet
      const team = (this.games[gameId] = new Match(gameId))
      response = {
        type: 'MatchedGame',
        teamId: teamId == undefined ? 1 : teamId,
        gameId: team.gameId,
        userId
      }
      return response
    }

    if (this.games.length == 0) {
      this.addNewGame()
    }

    // Attempt to put the player in an existing game. This array may include
    // the newly created game from a second ago
    const matched = this.findATeam(undefined, userId)
    if (matched) {
      response = {
        gameId: matched.gameId,
        teamId: teamId == undefined ? matched.teamId : teamId,
        userId,
        type: 'MatchedGame'
      }
      return response
    }

    // Make a new game and put the player there. This will happen when all the
    // current games already have at least 1 person on each team
    const newGameId = this.addNewGame()
    const team = this.findATeam(newGameId)
    if (team) {
      response = {
        type: 'MatchedGame',
        gameId: team.gameId,
        teamId: teamId == undefined ? team.teamId : teamId,
        userId
      }
      return response
    }

    console.trace()
    console.error('Somehow we made it all the way over here.')
  }
}
