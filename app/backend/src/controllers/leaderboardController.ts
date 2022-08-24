import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
// import JwtService from '../services/jwtService';
// import { ILeaderboard } from '../interfaces/ILeaderboard';
import { ILeaderboardService } from '../interfaces/ILeaderboardService';
// import ErrorHandler from '../utils/errorHandler';

export default class LeaderboardController {
  constructor(private matchesService: ILeaderboardService) { }

  async listHome(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const list = await this.matchesService.listHome();
      return res.status(StatusCodes.OK).json(list);
    } catch (err) {
      next(err);
    }
  }

  async listAway(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const list = await this.matchesService.listAway();
      return res.status(StatusCodes.OK).json(list);
    } catch (err) {
      next(err);
    }
  }

  async list(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const list = await this.matchesService.list();
      return res.status(StatusCodes.OK).json(list);
    } catch (err) {
      next(err);
    }
  }
}
