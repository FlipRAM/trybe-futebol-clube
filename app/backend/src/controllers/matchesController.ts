import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import JwtService from '../services/jwtService';
import { IMatches } from '../interfaces/IMatches';
import { IMatchesService } from '../interfaces/IMatchesService';
import ErrorHandler from '../utils/errorHandler';

export default class MatchesController {
  constructor(private matchesService: IMatchesService) { }

  async list(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { inProgress } = req.query;

      if (inProgress) {
        const whichProgress = (inProgress === 'true');
        const listByActivity = await this.matchesService.listByActivity(whichProgress);
        return res.status(StatusCodes.OK).json(listByActivity);
      }
      const list = await this.matchesService.list();
      return res.status(StatusCodes.OK).json(list);
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const token = req.headers.authorization;

    if (!token) throw new ErrorHandler(StatusCodes.UNAUTHORIZED, 'Token must be a valid token');

    try {
      JwtService.validateRole(token);
      const match = req.body as IMatches;
      const createdMatch = await this.matchesService.create(match);
      return res.status(StatusCodes.CREATED).json(createdMatch);
    } catch (err) {
      next(err);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { id } = req.params;
      const updated = await this.matchesService.updateStatus(parseInt(id, 10));
      if (updated) return res.status(StatusCodes.OK).json({ message: 'Finished' });
    } catch (err) {
      next(err);
    }
  }

  async updateGoals(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { id } = req.params;
      const { homeTeamGoals, awayTeamGoals } = req.body;
      const updated = await this.matchesService
        .updateGols(parseInt(id, 10), homeTeamGoals, awayTeamGoals);
      if (updated) return res.status(StatusCodes.OK).json({ message: 'Finished' });
    } catch (err) {
      next(err);
    }
  }

  // async findById(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  //   try {
  //     const { id } = req.params;
  //     const team = await this.teamsService.findById(parseInt(id, 10));
  //     return res.status(StatusCodes.OK).json(team);
  //   } catch (err) {
  //     next(err);
  //   }
  // }
}
