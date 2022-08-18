import * as bcrypt from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';
import ErrorHandler from '../utils/errorHandler';

const passwordService = {
  encryptPassword: (password: string): string => {
    const salt = bcrypt.genSaltSync(5);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
  },
  checkPassword: (password: string, hash: string) => {
    const match = bcrypt.compareSync(password, hash);

    if (!match) {
      throw new ErrorHandler(StatusCodes.UNAUTHORIZED, 'Incorrect email or password');
    }
  },
};

export default passwordService;
