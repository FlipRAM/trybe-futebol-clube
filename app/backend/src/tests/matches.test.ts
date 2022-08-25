import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
// import Example from '../database/models/ExampleModel';
import Matches from '../database/models/matches';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

const matchMock = {
  id: 1,
  homeTeam: 1,
  homeTeamGoals: 1,
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

const matchInProgressMock = {
  id: 1,
  homeTeam: 1,
  homeTeamGoals: 1,
  awayTeam: 8,
  awayTeamGoals: 1,
  inProgress: true,
  teamHome: {
    teamName: 'São Paulo'
  },
  teamAway: {
    teamName: 'Grêmio'
  }
}

const matchCreateMock = {
  id: 50,
  homeTeam: 1,
  homeTeamGoals: 1,
  awayTeam: 2,
  awayTeamGoals: 1,
  inProgress: true,
}

const correctToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoxLCJ1c2VybmFtZSI6IkFkbWluIiwicm9sZSI6ImFkbWluIiwiZW1haWwiOiJhZG1pbkBhZG1pbi5jb20iLCJwYXNzd29yZCI6IiQyYSQwOCR4aS5IeGsxY3pBTzBuWlIuLkIzOTN1MTBhRUQwUlExTjNQQUVYUTdIeHRMaktQRVpCdS5QVyJ9LCJpYXQiOjE2NjE0NTEyNzgsImV4cCI6MTY2MjA1NjA3OH0.wstjZC2jFxDzL-NdEf0DsJM_YrgotOIYvCR_TCDysFE'


describe('Returns correct matches list', () => {
  let chaiHttpResponse: Response;

  beforeEach(async () => {
    sinon
      .stub(Matches, "findAll")
      .resolves([matchMock as any]);
  });

  afterEach(()=>{
    (Matches.findAll as sinon.SinonStub).restore();
  })

  it('returns status 200', async () => {
    chaiHttpResponse = await chai
       .request(app)
       .get('/matches')

    expect(chaiHttpResponse.status).to.equal(200)
  });

  it('returns correct matches list', async () => {
    chaiHttpResponse = await chai
       .request(app)
       .get('/matches')

    const [matches] = chaiHttpResponse.body;

    expect(matches.id).to.equal(matchMock.id);
    expect(matches.homeTeam).to.equal(matchMock.homeTeam);
    expect(matches.homeTeamGoals).to.equal(matchMock.homeTeamGoals);
    expect(matches.awayTeam).to.equal(matchMock.awayTeam);
    expect(matches.awayTeamGoals).to.equal(matchMock.awayTeamGoals);
    expect(matches.inProgress).to.equal(matchMock.inProgress);
    expect(matches.teamHome.teamName).to.equal(matchMock.teamHome.teamName);
    expect(matches.teamAway.teamName).to.equal(matchMock.teamAway.teamName);
  });
});

describe('Returns correct matches list by activity', () => {
  let chaiHttpResponse: Response;

  beforeEach(async () => {
    sinon
      .stub(Matches, "findAll")
      .resolves([matchInProgressMock as any]);
  });

  afterEach(()=>{
    (Matches.findAll as sinon.SinonStub).restore();
  })

  it('returns status 200', async () => {
    chaiHttpResponse = await chai
       .request(app)
       .get('/matches/?inProgress=true')

    expect(chaiHttpResponse.status).to.equal(200)
  });

  it('returns correct in progress matches list', async () => {
    chaiHttpResponse = await chai
       .request(app)
       .get('/matches/?inProgress=true')

    const [matches] = chaiHttpResponse.body;

    expect(matches.id).to.equal(matchInProgressMock.id);
    expect(matches.homeTeam).to.equal(matchInProgressMock.homeTeam);
    expect(matches.homeTeamGoals).to.equal(matchInProgressMock.homeTeamGoals);
    expect(matches.awayTeam).to.equal(matchInProgressMock.awayTeam);
    expect(matches.awayTeamGoals).to.equal(matchInProgressMock.awayTeamGoals);
    expect(matches.inProgress).to.equal(matchInProgressMock.inProgress);
    expect(matches.teamHome.teamName).to.equal(matchInProgressMock.teamHome.teamName);
    expect(matches.teamAway.teamName).to.equal(matchInProgressMock.teamAway.teamName);
  });
});

describe('Returns correct when creating match', () => {
  let chaiHttpResponse: Response;

  beforeEach(async () => {
    sinon
      .stub(Matches, "create")
      .resolves(matchCreateMock as any)
  });

  afterEach(()=>{
    (Matches.create as sinon.SinonStub).restore();
  })

  it('returns status 201', async () => {
    chaiHttpResponse = await chai
       .request(app)
       .post('/matches')
       .send({
        homeTeam: 1,
        homeTeamGoals: 1,
        awayTeam: 2,
        awayTeamGoals: 1,
        inProgress: true,
       })
       .set('authorization', correctToken)

    expect(chaiHttpResponse.status).to.equal(201)
  });

  it('returns correct created match response', async () => {
    chaiHttpResponse = await chai
       .request(app)
       .post('/matches')
       .send({
        homeTeam: 1,
        homeTeamGoals: 1,
        awayTeam: 2,
        awayTeamGoals: 1,
        inProgress: true,
       })
       .set('authorization', correctToken)

    const match = chaiHttpResponse.body;
    
    expect(match.id).to.equal(matchCreateMock.id);
    expect(match.homeTeam).to.equal(matchCreateMock.homeTeam);
    expect(match.homeTeamGoals).to.equal(matchCreateMock.homeTeamGoals);
    expect(match.awayTeam).to.equal(matchCreateMock.awayTeam);
    expect(match.awayTeamGoals).to.equal(matchCreateMock.awayTeamGoals);
    expect(match.inProgress).to.equal(matchCreateMock.inProgress);
  });
});

describe('Returns correct when failing to create a match', () => {
  let chaiHttpResponse: Response;

  beforeEach(async () => {
    sinon
      .stub(Matches, "create")
      .resolves(matchCreateMock as any)
  });

  afterEach(()=>{
    (Matches.create as sinon.SinonStub).restore();
  })

  it('returns status 401 when team are duplicated', async () => {
    chaiHttpResponse = await chai
       .request(app)
       .post('/matches')
       .send({
        homeTeam: 1,
        homeTeamGoals: 1,
        awayTeam: 1,
        awayTeamGoals: 1,
        inProgress: true,
       })
       .set('authorization', correctToken)

    expect(chaiHttpResponse.status).to.equal(401)
  });

  it('returns correct when team are duplicated', async () => {
    chaiHttpResponse = await chai
       .request(app)
       .post('/matches')
       .send({
        homeTeam: 1,
        homeTeamGoals: 1,
        awayTeam: 1,
        awayTeamGoals: 1,
        inProgress: true,
       })
       .set('authorization', correctToken)

    const response = chaiHttpResponse.body;
    
    expect(response.message).to.equal('It is not possible to create a match with two equal teams');
  });

  it('returns status 404 when missing a team', async () => {
    chaiHttpResponse = await chai
       .request(app)
       .post('/matches')
       .send({
        homeTeam: 1,
        homeTeamGoals: 1,
        awayTeamGoals: 1,
        inProgress: true,
       })
       .set('authorization', correctToken)

    expect(chaiHttpResponse.status).to.equal(404)
  });

  it('returns correct when missing a team', async () => {
    chaiHttpResponse = await chai
       .request(app)
       .post('/matches')
       .send({
        homeTeam: 1,
        homeTeamGoals: 1,
        awayTeamGoals: 1,
        inProgress: true,
       })
       .set('authorization', correctToken)

    const response = chaiHttpResponse.body;
    
    expect(response.message).to.equal('There is no team with such id!');
  });
});

describe('Returns correct when updating a match', () => {
  let chaiHttpResponse: Response;

  beforeEach(async () => {
    sinon
      .stub(Matches, "update")
      .resolves([matchMock.id, [matchMock as any]])
  });

  afterEach(()=>{
    (Matches.update as sinon.SinonStub).restore();
  })

  it('returns status 200', async () => {
    chaiHttpResponse = await chai
       .request(app)
       .patch('/matches/1/finish')
       .set('authorization', correctToken)

    expect(chaiHttpResponse.status).to.equal(200)
  });

  it('returns correct message when updated', async () => {
    chaiHttpResponse = await chai
       .request(app)
       .patch('/matches/1/finish')
       .set('authorization', correctToken)

    const response = chaiHttpResponse.body;
    
    expect(response.message).to.equal('Finished');
  });
});

describe('Returns correct when failing to update a match', () => {
  let chaiHttpResponse: Response;

  beforeEach(async () => {
    sinon
      .stub(Matches, "update")
      .resolves(undefined)
  });

  afterEach(()=>{
    (Matches.update as sinon.SinonStub).restore();
  })

  it('returns status 404', async () => {
    chaiHttpResponse = await chai
       .request(app)
       .patch('/matches/999999/finish')
       .set('authorization', correctToken)

    expect(chaiHttpResponse.status).to.equal(404)
  });

  it('returns correct message when failing to update', async () => {
    chaiHttpResponse = await chai
       .request(app)
       .patch('/matches/999999/finish')
       .set('authorization', correctToken)

    const response = chaiHttpResponse.body;
    
    expect(response.message).to.equal('match not found');
  });
});

describe('Returns correct when updating goals on a match', () => {
  let chaiHttpResponse: Response;

  beforeEach(async () => {
    sinon
      .stub(Matches, "update")
      .resolves([matchMock.id, [matchMock as any]])
  });

  afterEach(()=>{
    (Matches.update as sinon.SinonStub).restore();
  })

  it('returns status 200', async () => {
    chaiHttpResponse = await chai
       .request(app)
       .patch('/matches/1')
       .set('authorization', correctToken)
       .send({
        homeTeamGoals: 2,
        awayTeamGoals: 2
       })

    expect(chaiHttpResponse.status).to.equal(200)
  });

  it('returns correct message when updated goals', async () => {
    chaiHttpResponse = await chai
       .request(app)
       .patch('/matches/1')
       .set('authorization', correctToken)
       .send({
        homeTeamGoals: 2,
        awayTeamGoals: 2
       })

    const response = chaiHttpResponse.body;
    
    expect(response.message).to.equal('Finished');
  });
});

describe('Returns correct when failing to update goals on a match', () => {
  let chaiHttpResponse: Response;

  beforeEach(async () => {
    sinon
      .stub(Matches, "update")
      .resolves(undefined)
  });

  afterEach(()=>{
    (Matches.update as sinon.SinonStub).restore();
  })

  it('returns status 404', async () => {
    chaiHttpResponse = await chai
       .request(app)
       .patch('/matches/999999')
       .set('authorization', correctToken)
       .send({
        homeTeamGoals: 2,
        awayTeamGoals: 2
       })

    expect(chaiHttpResponse.status).to.equal(404)
  });

  it('returns correct message when failing to update goals', async () => {
    chaiHttpResponse = await chai
       .request(app)
       .patch('/matches/999999')
       .set('authorization', correctToken)
       .send({
        homeTeamGoals: 2,
        awayTeamGoals: 2
       })

    const response = chaiHttpResponse.body;
    
    expect(response.message).to.equal('match not found');
  });
});