import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as Jwt from 'jsonwebtoken';
import JwtService from '../services/jwtService';
import { ILoginService } from '../interfaces/ILoginService';

export default class LoginController {
  public jwtService = JwtService;

  constructor(private loginService: ILoginService) { }

  async checkUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { email, password } = req.body;
      const token = await this.loginService.checkUser(email, password);
      return res.status(StatusCodes.OK).json({ token });
    } catch (err) {
      next(err);
    }
  }

  async validateRole(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const token = req.headers.authorization;

      if (!token) {
        return res.status(StatusCodes.UNAUTHORIZED)
          .json({ message: 'Token must be a valid token' });
      }

      const payload = await this.jwtService.validateRole(token);
      const { data: { role } } = payload as Jwt.JwtPayload;
      return res.status(StatusCodes.OK).json({ role });
    } catch (err) {
      next(err);
    }
  }
}
