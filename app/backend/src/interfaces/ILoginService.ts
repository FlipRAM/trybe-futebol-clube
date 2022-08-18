export interface ILoginService {
  checkUser(username: string, password: string): Promise<string | void>
}
