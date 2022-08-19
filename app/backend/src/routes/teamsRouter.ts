import { Router } from 'express';
import TeamsController from '../controllers/teamsController';
import TeamsService from '../services/teamsService';

export default class TeamsRouter {
  public router: Router;

  private controller: TeamsController = new TeamsController(new TeamsService());

  constructor() {
    this.router = Router();
    this.registerRoutes();
  }

  protected registerRoutes(): void {
    this.router.get('/', (req, res, next) => this.controller.list(req, res, next));
    this.router.get('/:id', (req, res, next) => this.controller.findById(req, res, next));
  }
}
