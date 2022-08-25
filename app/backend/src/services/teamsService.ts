// import * as Joi from 'joi';
import { StatusCodes } from 'http-status-codes';
import { ITeamsService } from '../interfaces/ITeamsService';
import { ITeams } from '../interfaces/ITeams';
import Teams from '../database/models/teams';
import ErrorHandler from '../utils/errorHandler';

export default class TeamsService implements ITeamsService {
  constructor(private teamsModels = Teams) { }

  async list(): Promise<ITeams[] | void> {
    const teamsList = await this.teamsModels.findAll();

    if (!teamsList) throw new ErrorHandler(StatusCodes.INTERNAL_SERVER_ERROR, 'Server Error');

    return teamsList;
  }

  async findById(id: number): Promise<ITeams | null> {
    const team = await this.teamsModels.findByPk(id);

    if (!team) throw new ErrorHandler(StatusCodes.NOT_FOUND, 'team not found');

    return team;
  }
}
