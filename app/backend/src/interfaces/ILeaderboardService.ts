import { ILeaderboard } from './ILeaderboard';

export interface ILeaderboardService {
  listHome(): Promise<ILeaderboard[] | void>,
  listAway(): Promise<ILeaderboard[] | void>,
  list(): Promise<ILeaderboard[] | void>,
  // listByActivity(progress: boolean): Promise<IMatches[] | void>,
  // create(match: IMatches): Promise<IMatches | void>,
  // updateStatus(id: number): Promise<boolean>,
  // updateGols(id: number, homeTeamGoals: number, awayTeamGoals: number): Promise<boolean>,
}
