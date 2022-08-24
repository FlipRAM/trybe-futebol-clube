import { Router } from 'express';
import LeaderboardService from '../services/leaderboardService';
import LeaderboardController from '../controllers/leaderboardController';

export default class LeaderboardRouter {
  public router: Router;

  private controller: LeaderboardController = new LeaderboardController(new LeaderboardService());

  constructor() {
    this.router = Router();
    this.registerRoutes();
  }

  protected registerRoutes(): void {
    this.router.get('/', (req, res, next) => this.controller.list(req, res, next));
    this.router.get('/home', (req, res, next) => this.controller.listHome(req, res, next));
    this.router.get('/away', (req, res, next) => this.controller.listAway(req, res, next));
  }
}
