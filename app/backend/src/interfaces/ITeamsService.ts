import { ITeams } from './ITeams';

export interface ITeamsService {
  list(): Promise<ITeams[] | void>;
  findById(id: number): Promise<ITeams | null>;
}
