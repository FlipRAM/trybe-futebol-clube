import { StatusCodes } from 'http-status-codes';
import * as Joi from 'joi';
import { ILoginService } from '../interfaces/ILoginService';
import Users from '../database/models/users';
import passwordService from './passwordService';
import ErrorHandler from '../utils/errorHandler';
import JwtService from './jwtService';

export default class LoginService implements ILoginService {
  constructor(private userModel = Users) { }

  async checkUser(email: string, password: string): Promise<string | void> {
    LoginService.validate(email, password);

    const match = await this.userModel.findOne({
      where: { email },
    });

    if (!match) throw new ErrorHandler(StatusCodes.UNAUTHORIZED, 'Incorrect email or password');

    passwordService.checkPassword(password, match.password);

    const token = JwtService.createToken(match);

    return token;
  }

  static validate(email: string, password: string): void {
    const schema = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });

    const { error } = schema.validate({ email, password });

    if (error) throw new ErrorHandler(StatusCodes.BAD_REQUEST, 'All fields must be filled');
  }
}
