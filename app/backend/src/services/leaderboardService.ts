import { ILeaderboardService } from '../interfaces/ILeaderboardService';
import Matches from '../database/models/matches';
import { ILeaderboard } from '../interfaces/ILeaderboard';
import Teams from '../database/models/teams';
import { IMatches } from '../interfaces/IMatches';

const totalPoints = (matches: IMatches[], isAway: boolean): number => {
  if (isAway) {
    const points = matches.reduce((acc: number, curr: IMatches) => {
      if (curr.homeTeamGoals < curr.awayTeamGoals) return acc + 3;
      if (curr.homeTeamGoals === curr.awayTeamGoals) return acc + 1;
      return acc;
    }, 0);
    return points;
  }
  const points = matches.reduce((acc: number, curr: IMatches) => {
    if (curr.homeTeamGoals > curr.awayTeamGoals) return acc + 3;
    if (curr.homeTeamGoals === curr.awayTeamGoals) return acc + 1;
    return acc;
  }, 0);
  return points;
};

const totalVictories = (matches: IMatches[], isAway: boolean): number => {
  if (isAway) {
    const victories = matches.reduce((acc: number, curr: IMatches) => {
      if (curr.homeTeamGoals < curr.awayTeamGoals) return acc + 1;
      return acc;
    }, 0);
    return victories;
  }
  const victories = matches.reduce((acc: number, curr: IMatches) => {
    if (curr.homeTeamGoals > curr.awayTeamGoals) return acc + 1;
    return acc;
  }, 0);
  return victories;
};

const totalDraws = (matches: IMatches[], isAway: boolean): number => {
  if (isAway) {
    const draws = matches.reduce((acc: number, curr: IMatches) => {
      if (curr.homeTeamGoals === curr.awayTeamGoals) return acc + 1;
      return acc;
    }, 0);
    return draws;
  }
  const draws = matches.reduce((acc: number, curr: IMatches) => {
    if (curr.homeTeamGoals === curr.awayTeamGoals) return acc + 1;
    return acc;
  }, 0);
  return draws;
};

const totalLosses = (matches: IMatches[], isAway: boolean): number => {
  if (isAway) {
    const losses = matches.reduce((acc: number, curr: IMatches) => {
      if (curr.homeTeamGoals > curr.awayTeamGoals) return acc + 1;
      return acc;
    }, 0);
    return losses;
  }
  const losses = matches.reduce((acc: number, curr: IMatches) => {
    if (curr.homeTeamGoals < curr.awayTeamGoals) return acc + 1;
    return acc;
  }, 0);
  return losses;
};

const totalGoalsFavor = (matches: IMatches[], isAway: boolean): number => {
  if (isAway) {
    const goalsFavor = matches.reduce((acc: number, curr: IMatches) => acc + curr.awayTeamGoals, 0);
    return goalsFavor;
  }
  const goalsFavor = matches.reduce((acc: number, curr: IMatches) => acc + curr.homeTeamGoals, 0);
  return goalsFavor;
};

const totalGoalsOwn = (matches: IMatches[], isAway: boolean): number => {
  if (isAway) {
    const goalsOwn = matches.reduce((acc: number, curr: IMatches) => acc + curr.homeTeamGoals, 0);
    return goalsOwn;
  }
  const goalsOwn = matches.reduce((acc: number, curr: IMatches) => acc + curr.awayTeamGoals, 0);
  return goalsOwn;
};

const formatLeaderboard = (teamName: string, matches: IMatches[], isAway: boolean) => ({
  name: teamName,
  totalPoints: totalPoints(matches, isAway),
  totalGames: matches.length,
  totalVictories: totalVictories(matches, isAway),
  totalDraws: totalDraws(matches, isAway),
  totalLosses: totalLosses(matches, isAway),
  goalsFavor: totalGoalsFavor(matches, isAway),
  goalsOwn: totalGoalsOwn(matches, isAway),
  goalsBalance: totalGoalsFavor(matches, isAway) - totalGoalsOwn(matches, isAway),
  efficiency: Number(((totalPoints(matches, isAway) / (matches.length * 3)) * 100).toFixed(2)),
});

const ranking = (leaderboard: ILeaderboard[]) => {
  const rank = leaderboard.sort((a: ILeaderboard, b: ILeaderboard) => {
    if (a.totalPoints > b.totalPoints) return -1;
    if (a.totalPoints < b.totalPoints) return 1;

    if (a.totalVictories > b.totalVictories) return -1;
    if (a.totalVictories < b.totalVictories) return 1;

    if (a.goalsBalance > b.goalsBalance) return -1;
    if (a.goalsBalance < b.goalsBalance) return 1;

    if (a.goalsFavor > b.goalsFavor) return -1;
    if (a.goalsFavor < b.goalsFavor) return 1;

    if (a.goalsOwn > b.goalsOwn) return -1;
    if (a.goalsOwn < b.goalsOwn) return 1;

    return 0;
  });
  return rank;
};

const sumHomeAway = (aHome: ILeaderboard, aAway: ILeaderboard) => ({
  name: aHome.name,
  totalPoints: aHome.totalPoints + aAway.totalPoints,
  totalGames: aHome.totalGames + aAway.totalGames,
  totalVictories: aHome.totalVictories + aAway.totalVictories,
  totalDraws: aHome.totalDraws + aAway.totalDraws,
  totalLosses: aHome.totalLosses + aAway.totalLosses,
  goalsFavor: aHome.goalsFavor + aAway.goalsFavor,
  goalsOwn: aHome.goalsOwn + aAway.goalsOwn,
  goalsBalance: aHome.goalsBalance + aAway.goalsBalance,
  efficiency: Number((((aHome.totalPoints + aAway.totalPoints)
    / ((aHome.totalGames + aAway.totalGames) * 3)) * 100).toFixed(2)),
});

export default class LeaderboardService implements ILeaderboardService {
  constructor(private matchesModels = Matches, private teamsModels = Teams) { }

  async getFinishedHomeMatches(id: number) {
    const finished = await this.matchesModels.findAll(
      { where: { inProgress: 0, homeTeam: id },
        include: [
          { model: Teams, as: 'teamHome', attributes: { exclude: ['id'] } },
          { model: Teams, as: 'teamAway', attributes: { exclude: ['id'] } },
        ],
      },
    );
    return finished;
  }

  async getFinishedAwayMatches(id: number) {
    const finished = await this.matchesModels.findAll(
      { where: { inProgress: 0, awayTeam: id },
        include: [
          { model: Teams, as: 'teamHome', attributes: { exclude: ['id'] } },
          { model: Teams, as: 'teamAway', attributes: { exclude: ['id'] } },
        ],
      },
    );
    return finished;
  }

  async listHome(): Promise<ILeaderboard[] | void> {
    const allTeams = await this.teamsModels.findAll();
    const matchesArr = await Promise.all(allTeams.map(async (element: any) => {
      const matches = await this.getFinishedHomeMatches(element.id);
      return { teamName: element.teamName, matches };
    }));
    const leaderboard = matchesArr.map(
      ({ teamName, matches }) => formatLeaderboard(teamName, matches, false),
    );

    return ranking(leaderboard);
  }

  async listAway(): Promise<ILeaderboard[] | void> {
    const allTeams = await this.teamsModels.findAll();
    const matchesArr = await Promise.all(allTeams.map(async (element: any) => {
      const matches = await this.getFinishedAwayMatches(element.id);
      return { teamName: element.teamName, matches };
    }));
    const leaderboard = matchesArr.map(
      ({ teamName, matches }) => formatLeaderboard(teamName, matches, true),
    );

    return ranking(leaderboard);
  }

  async list(): Promise<ILeaderboard[] | void> {
    const leaderboardHome = await this.listHome();
    const leaderboardAway = await this.listAway();
    if (leaderboardHome && leaderboardAway) {
      const leaderboard = leaderboardHome.map((element) => {
        const match = leaderboardAway.find((team) => team.name === element.name);
        if (match) return sumHomeAway(element, match);
        return element;
      });
      return ranking(leaderboard);
    }
  }
}
