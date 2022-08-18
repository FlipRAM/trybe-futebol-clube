import * as express from 'express';
import errorMiddleware from '../middlewares/errorMiddleware';
import LoginRouter from './loginRouter';

const routes = (app: express.Application): void => {
  app.use('/login', new LoginRouter().router);
  app.use(errorMiddleware);
};

export default routes;
