import { IMatches } from './IMatches';

export interface IMatchesService {
  list(): Promise<IMatches[] | void>,
  listByActivity(progress: boolean): Promise<IMatches[] | void>,
  create(match: IMatches): Promise<IMatches | void>,
  updateStatus(id: number): Promise<boolean>,
  updateGols(id: number, homeTeamGoals: number, awayTeamGoals: number): Promise<boolean>,
}
