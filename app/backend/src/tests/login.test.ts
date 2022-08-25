import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
// import Example from '../database/models/ExampleModel';
import Users from '../database/models/users';
import { IUser } from '../interfaces/IUser';
import JwtService from '../services/jwtService';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

const userBodyMock = {
  email: 'admin@admin.com',
  password: 'secret_admin'
}

const userIncorrectMock = {
  email: 'qualquer@email.com',
  password: 'qualquercoisa'
}

const userMissingField = {
  email: 'some@email.com',
}

const userMock: IUser = {
  id: 1,
  username: 'Admin',
  role: 'admin',
  email: 'admin@admin.com',
  password: '$2a$08$xi.Hxk1czAO0nZR..B393u10aED0RQ1N3PAEXQ7HxtLjKPEZBu.PW',
}

const correctToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoxLCJ1c2VybmFtZSI6IkFkbWluIiwicm9sZSI6ImFkbWluIiwiZW1haWwiOiJhZG1pbkBhZG1pbi5jb20iLCJwYXNzd29yZCI6IiQyYSQwOCR4aS5IeGsxY3pBTzBuWlIuLkIzOTN1MTBhRUQwUlExTjNQQUVYUTdIeHRMaktQRVpCdS5QVyJ9LCJpYXQiOjE2NjE0NTEyNzgsImV4cCI6MTY2MjA1NjA3OH0.wstjZC2jFxDzL-NdEf0DsJM_YrgotOIYvCR_TCDysFE'

describe('Check correct User', () => {
  let chaiHttpResponse: Response;

  beforeEach(async () => {
    sinon
      .stub(Users, "findOne")
      .resolves(userMock as Users);
    sinon
    .stub(JwtService, "createToken")
    .resolves(correctToken);
  });

  afterEach(()=>{
    (Users.findOne as sinon.SinonStub).restore();
    (JwtService.createToken as sinon.SinonStub).restore();
  })

  it('returns status 200', async () => {
    chaiHttpResponse = await chai
       .request(app)
       .post('/login')
       .send(userBodyMock)

    expect(chaiHttpResponse.status).to.equal(200)
  });

  it('returns correct token', async () => {
    chaiHttpResponse = await chai
       .request(app)
       .post('/login')
       .send(userBodyMock)

    const response = chaiHttpResponse.body;

    expect(response.token).to.equal(correctToken);
  });
});

describe('Check incorrect User', () => {
  let chaiHttpResponse: Response;

  beforeEach(async () => {
    sinon
      .stub(Users, "findOne")
      .resolves(undefined);
  });

  afterEach(()=>{
    (Users.findOne as sinon.SinonStub).restore();
  })

  it('returns status 401', async () => {
    chaiHttpResponse = await chai
       .request(app)
       .post('/login')
       .send(userIncorrectMock)

    expect(chaiHttpResponse.status).to.equal(401)
  });

  it('returns correct message', async () => {
    chaiHttpResponse = await chai
       .request(app)
       .post('/login')
       .send(userIncorrectMock)

    const response = chaiHttpResponse.body;

    expect(response.message).to.equal('Incorrect email or password');
  });

  it('returns status 400 when missing field', async () => {
    chaiHttpResponse = await chai
       .request(app)
       .post('/login')
       .send(userMissingField)

    expect(chaiHttpResponse.status).to.equal(400)
  });

  it('returns correct message', async () => {
    chaiHttpResponse = await chai
       .request(app)
       .post('/login')
       .send(userMissingField)

    const response = chaiHttpResponse.body;

    expect(response.message).to.equal('All fields must be filled');
  });
});

describe('Validate corect role', () => {
  let chaiHttpResponse: Response;

  beforeEach(async () => {
    sinon
      .stub(JwtService, "validateRole")
      .resolves({ data: userMock });
  });

  afterEach(()=>{
    (JwtService.validateRole as sinon.SinonStub).restore();
  })

  it('returns correct role', async () => {
    chaiHttpResponse = await chai
       .request(app)
       .get('/login/validate')
       .set('authorization', correctToken)

    const response = chaiHttpResponse.body;

    expect(response.role).to.equal(userMock.role)
  });
});

describe('Check incorrect validateRole', () => {
  let chaiHttpResponse: Response;

  beforeEach(async () => {
    sinon
      .stub(JwtService, "validateRole")
      .resolves(undefined);
  });

  afterEach(()=>{
    (JwtService.validateRole as sinon.SinonStub).restore();
  })

  it('returns status 401', async () => {
    chaiHttpResponse = await chai
       .request(app)
       .get('/login/validate')

    expect(chaiHttpResponse.status).to.equal(401)
  });

  it('returns correct message', async () => {
    chaiHttpResponse = await chai
       .request(app)
       .get('/login/validate')

    const response = chaiHttpResponse.body;

    expect(response.message).to.equal('Token must be a valid token');
  });
});