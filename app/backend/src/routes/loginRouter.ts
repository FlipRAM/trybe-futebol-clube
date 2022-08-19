import { Router } from 'express';
import LoginService from '../services/loginService';
import LoginController from '../controllers/loginController';

export default class LoginRouter {
  public router: Router;

  private controller: LoginController = new LoginController(new LoginService());

  constructor() {
    this.router = Router();
    this.registerRoutes();
  }

  protected registerRoutes(): void {
    this.router.get('/validate', (req, res, next) => this.controller.validateRole(req, res, next));
    this.router.post('/', (req, res, next) => this.controller.checkUser(req, res, next));
  }
}
