import * as express from 'express';
import errorMiddleware from '../middlewares/errorMiddleware';
import LeaderboardRouter from './leaderboardRouter';
import LoginRouter from './loginRouter';
import MatchesRouter from './matchesRouter';
import TeamsRouter from './teamsRouter';

const routes = (app: express.Application): void => {
  app.use('/login', new LoginRouter().router);
  app.use('/teams', new TeamsRouter().router);
  app.use('/matches', new MatchesRouter().router);
  app.use('/leaderboard', new LeaderboardRouter().router);
  app.use(errorMiddleware);
};

export default routes;
