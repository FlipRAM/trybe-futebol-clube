import { Router } from 'express';
import MatchesService from '../services/matchesService';
import MatchesController from '../controllers/matchesController';

export default class MatchesRouter {
  public router: Router;

  private controller: MatchesController = new MatchesController(new MatchesService());

  constructor() {
    this.router = Router();
    this.registerRoutes();
  }

  protected registerRoutes(): void {
    this.router.get('/', (req, res, next) => this.controller.list(req, res, next));
    this.router.post('/', (req, res, next) => this.controller.create(req, res, next));
    this.router.patch('/:id', (req, res, next) => this.controller.updateGoals(req, res, next));
    this.router.patch(
      '/:id/finish',
      (req, res, next) => this.controller.updateStatus(req, res, next),
    );
  }
}
