// import * as Joi from 'joi';
// import { StatusCodes } from 'http-status-codes';
// import ErrorHandler from '../utils/errorHandler';
import { StatusCodes } from 'http-status-codes';
import { IMatchesService } from '../interfaces/IMatchesService';
import Matches from '../database/models/matches';
import { IMatches } from '../interfaces/IMatches';
import Teams from '../database/models/teams';
import ErrorHandler from '../utils/errorHandler';

export default class MatchesService implements IMatchesService {
  constructor(private matchesModels = Matches, private teamsModels = Teams) { }

  async list(): Promise<IMatches[] | void> {
    const teamsList = await this.matchesModels.findAll({
      include: [
        {
          model: Teams,
          as: 'teamHome',
          attributes: ['teamName'],
        },
        {
          model: Teams,
          as: 'teamAway',
          attributes: ['teamName'],
        },
      ],
    });

    return teamsList;
  }

  async listByActivity(progress: boolean): Promise<IMatches[] | void> {
    const teamsList = await this.matchesModels.findAll({
      include: [
        {
          model: Teams,
          as: 'teamHome',
          attributes: ['teamName'],
        },
        {
          model: Teams,
          as: 'teamAway',
          attributes: ['teamName'],
        },
      ],
      where: {
        inProgress: progress,
      },
    });

    return teamsList;
  }

  async create(match: IMatches): Promise<void | IMatches> {
    if (match.homeTeam === match.awayTeam) {
      throw new ErrorHandler(
        StatusCodes.UNAUTHORIZED,
        'It is not possible to create a match with two equal teams',
      );
    }

    const teamOne = await this.teamsModels.findByPk(match.homeTeam);
    const teamTwo = await this.teamsModels.findByPk(match.awayTeam);

    if (!teamOne || !teamTwo) {
      throw new ErrorHandler(StatusCodes.NOT_FOUND, 'There is no team with such id!');
    }

    const matchToCreate = {
      ...match,
      inProgress: true,
    };
    const createdMatch = await this.matchesModels.create(matchToCreate);

    return createdMatch;
  }

  async updateStatus(id: number): Promise<boolean> {
    const matchExists = await this.matchesModels.findByPk(id);

    if (!matchExists) throw new ErrorHandler(StatusCodes.NOT_FOUND, 'match not found');

    await this.matchesModels.update(
      { inProgress: false },
      { where: { id, inProgress: true } },
    );

    return true;
  }

  async updateGols(id: number, homeTeamGoals: number, awayTeamGoals: number): Promise<boolean> {
    const matchExists = await this.matchesModels.findByPk(id);

    if (!matchExists) throw new ErrorHandler(StatusCodes.NOT_FOUND, 'match not found');

    await this.matchesModels.update(
      { homeTeamGoals, awayTeamGoals },
      { where: { id } },
    );

    return true;
  }
}
