import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
// import Example from '../database/models/ExampleModel';
import Teams from '../database/models/teams';
import { ITeams } from '../interfaces/ITeams';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

const teamMock: ITeams = {
  id: 1,
  teamName: 'Avaí/Kindermann'
}

describe('Returns correct teams list', () => {
  let chaiHttpResponse: Response;

  beforeEach(async () => {
    sinon
      .stub(Teams, "findAll")
      .resolves([teamMock as Teams]);
  });

  afterEach(()=>{
    (Teams.findAll as sinon.SinonStub).restore();
  })

  it('returns status 200', async () => {
    chaiHttpResponse = await chai
       .request(app)
       .get('/teams')

    expect(chaiHttpResponse.status).to.equal(200)
  });

  it('returns correct teams list', async () => {
    chaiHttpResponse = await chai
       .request(app)
       .get('/teams')

    const [teams] = chaiHttpResponse.body as ITeams[];

    expect(teams.id).to.equal(teamMock.id);
    expect(teams.teamName).to.equal(teamMock.teamName);
  });
});

describe('Returns correct when list fails', () => {
  let chaiHttpResponse: Response;

  beforeEach(async () => {
    sinon
      .stub(Teams, "findAll")
      .resolves(undefined);
  });

  afterEach(()=>{
    (Teams.findAll as sinon.SinonStub).restore();
  })

  it('returns status 500', async () => {
    chaiHttpResponse = await chai
       .request(app)
       .get('/teams')

    expect(chaiHttpResponse.status).to.equal(500)
  });

  it('returns correct message', async () => {
    chaiHttpResponse = await chai
       .request(app)
       .get('/teams')

    const response = chaiHttpResponse.body;

    expect(response.message).to.equal('Server Error');
  });
});

describe('Returns correct teams by id', () => {
  let chaiHttpResponse: Response;

  beforeEach(async () => {
    sinon
      .stub(Teams, "findByPk")
      .resolves(teamMock as Teams);
  });

  afterEach(()=>{
    (Teams.findByPk as sinon.SinonStub).restore();
  })

  it('returns status 200', async () => {
    chaiHttpResponse = await chai
       .request(app)
       .get('/teams/1')

    expect(chaiHttpResponse.status).to.equal(200)
  });

  it('returns correct team', async () => {
    chaiHttpResponse = await chai
       .request(app)
       .get('/teams/1')

    const team = chaiHttpResponse.body as ITeams;

    expect(team.id).to.equal(teamMock.id);
    expect(team.teamName).to.equal(teamMock.teamName);
  });
});

describe('Returns correct message when no team is found', () => {
  let chaiHttpResponse: Response;

  beforeEach(async () => {
    sinon
      .stub(Teams, "findByPk")
      .resolves(undefined);
  });

  afterEach(()=>{
    (Teams.findByPk as sinon.SinonStub).restore();
  })

  it('returns status 404', async () => {
    chaiHttpResponse = await chai
       .request(app)
       .get('/teams/99999')

    expect(chaiHttpResponse.status).to.equal(404)
  });

  it('returns correct message', async () => {
    chaiHttpResponse = await chai
       .request(app)
       .get('/teams/99999')

    const response = chaiHttpResponse.body;

    expect(response.message).to.equal('team not found');
  });
});
