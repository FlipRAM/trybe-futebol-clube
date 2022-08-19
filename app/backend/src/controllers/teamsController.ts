import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ITeamsService } from '../interfaces/ITeamsService';

export default class TeamsController {
  constructor(private teamsService: ITeamsService) { }

  async list(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const list = await this.teamsService.list();
      return res.status(StatusCodes.OK).json(list);
    } catch (err) {
      next(err);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { id } = req.params;
      const team = await this.teamsService.findById(parseInt(id, 10));
      return res.status(StatusCodes.OK).json(team);
    } catch (err) {
      next(err);
    }
  }
}
