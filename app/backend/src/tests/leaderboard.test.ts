import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
// import Example from '../database/models/ExampleModel';
import Matches from '../database/models/matches';
import Teams from '../database/models/teams';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

const matchOneMock = {
  id: 1,
  homeTeam: 1,
  homeTeamGoals: 2,
  awayTeam: 8,
  awayTeamGoals: 1,
  inProgress: false,
  teamHome: {
    teamName: 'São Paulo'
  },
  teamAway: {
    teamName: 'Grêmio'
  }
}

const matchTwoMock = {
  id: 2,
  homeTeam: 8,
  homeTeamGoals: 1,
  awayTeam: 1,
  awayTeamGoals: 1,
  inProgress: false,
  teamHome: {
    teamName: 'Grêmio'
  },
  teamAway: {
    teamName: 'São Paulo'
  }
}

const matchThreeMock = {
  id: 3,
  homeTeam: 1,
  homeTeamGoals: 4,
  awayTeam: 8,
  awayTeamGoals: 2,
  inProgress: false,
  teamHome: {
    teamName: 'São Paulo'
  },
  teamAway: {
    teamName: 'Grêmio'
  }
}

const teamsAndMatchesHome = [
  {
    teamName: 'São Paulo',
    matches: [ matchOneMock, matchThreeMock ],
  },
  {
    teamName: 'Grêmio',
    matches: [ matchTwoMock ],
  }
]

const teamsAndMatchesAway = [
  {
    teamName: 'São Paulo',
    matches: [ matchTwoMock ],
  },
  {
    teamName: 'Grêmio',
    matches: [ matchOneMock, matchThreeMock ],
  }
]

const leaderboardHome = [
  {
		name: 'São Paulo',
		totalPoints: 6,
		totalGames: 2,
		totalVictories: 2,
		totalDraws: 0,
		totalLosses: 0,
		goalsFavor: 6,
		goalsOwn: 3,
		goalsBalance: 3,
		efficiency: 100
	},
	{
		name: 'Grêmio',
		totalPoints: 1,
		totalGames: 1,
		totalVictories: 0,
		totalDraws: 1,
		totalLosses: 0,
		goalsFavor: 1,
		goalsOwn: 1,
		goalsBalance: 0,
		efficiency: 33.33
	},
]

const leaderboardAway = [
  {
		name: 'São Paulo',
		totalPoints: 1,
		totalGames: 1,
		totalVictories: 0,
		totalDraws: 1,
		totalLosses: 0,
		goalsFavor: 1,
		goalsOwn: 1,
		goalsBalance: 0,
		efficiency: 33.33
	},
	{
		name: 'Grêmio',
		totalPoints: 0,
		totalGames: 2,
		totalVictories: 0,
		totalDraws: 0,
		totalLosses: 2,
		goalsFavor: 3,
		goalsOwn: 6,
		goalsBalance: -3,
		efficiency: 0
	},
]

const teamsAndMatches = teamsAndMatchesAway;

const leaderboardTotal = [
  {
    name: 'Grêmio',
    totalPoints: 6,
    totalGames: 4,
    totalVictories: 2,
    totalDraws: 0,
    totalLosses: 2,
    goalsFavor: 9,
    goalsOwn: 9,
    goalsBalance: 0,
    efficiency: 50
  },
  {
		name: 'São Paulo',
		totalPoints: 2,
		totalGames: 2,
		totalVictories: 0,
		totalDraws: 2,
		totalLosses: 0,
		goalsFavor: 2,
		goalsOwn: 2,
		goalsBalance: 0,
		efficiency: 33.33
	},
];

describe('Returns correct leaderboard home list', () => {
  let chaiHttpResponse: Response;

  beforeEach(async () => {
    sinon
      .stub(Promise, "all")
      .resolves(teamsAndMatchesHome);
  });

  afterEach(()=>{
    (Promise.all as sinon.SinonStub).restore();
  })

  it('returns status 200', async () => {
    chaiHttpResponse = await chai
       .request(app)
       .get('/leaderboard/home')

    expect(chaiHttpResponse.status).to.equal(200)
  });

  it('returns correct leaderboard home list', async () => {
    chaiHttpResponse = await chai
       .request(app)
       .get('/leaderboard/home')

    const leaderboard = chaiHttpResponse.body;
    
    expect(leaderboard[0].name).to.equal(leaderboardHome[0].name);
    expect(leaderboard[0].totalPoints).to.equal(leaderboardHome[0].totalPoints);
    expect(leaderboard[0].totalGames).to.equal(leaderboardHome[0].totalGames);
    expect(leaderboard[0].totalVictories).to.equal(leaderboardHome[0].totalVictories);
    expect(leaderboard[0].totalDraws).to.equal(leaderboardHome[0].totalDraws);
    expect(leaderboard[0].totalLosses).to.equal(leaderboardHome[0].totalLosses);
    expect(leaderboard[0].goalsFavor).to.equal(leaderboardHome[0].goalsFavor);
    expect(leaderboard[0].goalsOwn).to.equal(leaderboardHome[0].goalsOwn);
    expect(leaderboard[0].goalsBalance).to.equal(leaderboardHome[0].goalsBalance);
    expect(leaderboard[0].efficiency).to.equal(leaderboardHome[0].efficiency);

    expect(leaderboard[1].name).to.equal(leaderboardHome[1].name);
    expect(leaderboard[1].totalPoints).to.equal(leaderboardHome[1].totalPoints);
    expect(leaderboard[1].totalGames).to.equal(leaderboardHome[1].totalGames);
    expect(leaderboard[1].totalVictories).to.equal(leaderboardHome[1].totalVictories);
    expect(leaderboard[1].totalDraws).to.equal(leaderboardHome[1].totalDraws);
    expect(leaderboard[1].totalLosses).to.equal(leaderboardHome[1].totalLosses);
    expect(leaderboard[1].goalsFavor).to.equal(leaderboardHome[1].goalsFavor);
    expect(leaderboard[1].goalsOwn).to.equal(leaderboardHome[1].goalsOwn);
    expect(leaderboard[1].goalsBalance).to.equal(leaderboardHome[1].goalsBalance);
    expect(leaderboard[1].efficiency).to.equal(leaderboardHome[1].efficiency);
  });
});

describe('Returns correct leaderboard away list', () => {
  let chaiHttpResponse: Response;

  beforeEach(async () => {
    sinon
      .stub(Promise, "all")
      .resolves(teamsAndMatchesAway);
  });

  afterEach(()=>{
    (Promise.all as sinon.SinonStub).restore();
  })

  it('returns status 200', async () => {
    chaiHttpResponse = await chai
       .request(app)
       .get('/leaderboard/away')

    expect(chaiHttpResponse.status).to.equal(200)
  });

  it('returns correct leaderboard away list', async () => {
    chaiHttpResponse = await chai
       .request(app)
       .get('/leaderboard/away')

    const leaderboard = chaiHttpResponse.body;
    
    expect(leaderboard[0].name).to.equal(leaderboardAway[0].name);
    expect(leaderboard[0].totalPoints).to.equal(leaderboardAway[0].totalPoints);
    expect(leaderboard[0].totalGames).to.equal(leaderboardAway[0].totalGames);
    expect(leaderboard[0].totalVictories).to.equal(leaderboardAway[0].totalVictories);
    expect(leaderboard[0].totalDraws).to.equal(leaderboardAway[0].totalDraws);
    expect(leaderboard[0].totalLosses).to.equal(leaderboardAway[0].totalLosses);
    expect(leaderboard[0].goalsFavor).to.equal(leaderboardAway[0].goalsFavor);
    expect(leaderboard[0].goalsOwn).to.equal(leaderboardAway[0].goalsOwn);
    expect(leaderboard[0].goalsBalance).to.equal(leaderboardAway[0].goalsBalance);
    expect(leaderboard[0].efficiency).to.equal(leaderboardAway[0].efficiency);

    expect(leaderboard[1].name).to.equal(leaderboardAway[1].name);
    expect(leaderboard[1].totalPoints).to.equal(leaderboardAway[1].totalPoints);
    expect(leaderboard[1].totalGames).to.equal(leaderboardAway[1].totalGames);
    expect(leaderboard[1].totalVictories).to.equal(leaderboardAway[1].totalVictories);
    expect(leaderboard[1].totalDraws).to.equal(leaderboardAway[1].totalDraws);
    expect(leaderboard[1].totalLosses).to.equal(leaderboardAway[1].totalLosses);
    expect(leaderboard[1].goalsFavor).to.equal(leaderboardAway[1].goalsFavor);
    expect(leaderboard[1].goalsOwn).to.equal(leaderboardAway[1].goalsOwn);
    expect(leaderboard[1].goalsBalance).to.equal(leaderboardAway[1].goalsBalance);
    expect(leaderboard[1].efficiency).to.equal(leaderboardAway[1].efficiency);
  });
});

describe('Returns correct leaderboard list', () => {
  let chaiHttpResponse: Response;

  beforeEach(async () => {
    sinon
      .stub(Promise, "all")
      .resolves(teamsAndMatches);
  });

  afterEach(()=>{
    (Promise.all as sinon.SinonStub).restore();
  })

  it('returns status 200', async () => {
    chaiHttpResponse = await chai
       .request(app)
       .get('/leaderboard')

    expect(chaiHttpResponse.status).to.equal(200)
  });

  it('returns correct leaderboard away list', async () => {
    chaiHttpResponse = await chai
       .request(app)
       .get('/leaderboard')

    const leaderboard = chaiHttpResponse.body;
    console.log(leaderboard);
    
    expect(leaderboard[0].name).to.equal(leaderboardTotal[0].name);
    expect(leaderboard[0].totalPoints).to.equal(leaderboardTotal[0].totalPoints);
    expect(leaderboard[0].totalGames).to.equal(leaderboardTotal[0].totalGames);
    expect(leaderboard[0].totalVictories).to.equal(leaderboardTotal[0].totalVictories);
    expect(leaderboard[0].totalDraws).to.equal(leaderboardTotal[0].totalDraws);
    expect(leaderboard[0].totalLosses).to.equal(leaderboardTotal[0].totalLosses);
    expect(leaderboard[0].goalsFavor).to.equal(leaderboardTotal[0].goalsFavor);
    expect(leaderboard[0].goalsOwn).to.equal(leaderboardTotal[0].goalsOwn);
    expect(leaderboard[0].goalsBalance).to.equal(leaderboardTotal[0].goalsBalance);
    expect(leaderboard[0].efficiency).to.equal(leaderboardTotal[0].efficiency);

    expect(leaderboard[1].name).to.equal(leaderboardTotal[1].name);
    expect(leaderboard[1].totalPoints).to.equal(leaderboardTotal[1].totalPoints);
    expect(leaderboard[1].totalGames).to.equal(leaderboardTotal[1].totalGames);
    expect(leaderboard[1].totalVictories).to.equal(leaderboardTotal[1].totalVictories);
    expect(leaderboard[1].totalDraws).to.equal(leaderboardTotal[1].totalDraws);
    expect(leaderboard[1].totalLosses).to.equal(leaderboardTotal[1].totalLosses);
    expect(leaderboard[1].goalsFavor).to.equal(leaderboardTotal[1].goalsFavor);
    expect(leaderboard[1].goalsOwn).to.equal(leaderboardTotal[1].goalsOwn);
    expect(leaderboard[1].goalsBalance).to.equal(leaderboardTotal[1].goalsBalance);
    expect(leaderboard[1].efficiency).to.equal(leaderboardTotal[1].efficiency);
  });
});
