import * as jwt from 'jsonwebtoken';
import 'dotenv/config';
import { StatusCodes } from 'http-status-codes';
import ErrorHandler from '../utils/errorHandler';
import { IUser } from '../interfaces/IUser';

const secret = process.env.JWT_SECRET || 'trybe';

export default class JwtService {
  static createToken(payload: Omit<IUser, 'password'>): string {
    const token = jwt.sign({ data: payload }, secret, { expiresIn: '7d', algorithm: 'HS256' });
    return token;
  }

  static validateRole(token: string) {
    try {
      const payload = jwt.verify(token, secret);
      return payload;
    } catch (err) {
      throw new ErrorHandler(StatusCodes.UNAUTHORIZED, 'Token must be a valid token');
    }
  }
}
