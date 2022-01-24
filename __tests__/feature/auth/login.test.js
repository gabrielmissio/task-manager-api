const ROUTE = '/login';
const request = require('supertest');

const app = require('../../../src/main/confing/app');
const { DataFakerHelper, ProfileDataFaker } = require('../../helpers');
const { DynamodbClient } = require('../../../src/infra/db/dynamodb/helpers');
const { TASK_MANAGER_TABLE_NAME } = require('../../../src/main/confing/env');

const makeRequestBody = (profileFake = {}) => ({
  email: profileFake.email || DataFakerHelper.getEmail(),
  password: profileFake.password || DataFakerHelper.getPassword()
});

describe(`Given the ${ROUTE} route`, () => {
  describe('And a POST request is performed', () => {
    describe('And no parameters provided in the request body', () => {
      let response;
      beforeAll(async () => {
        response = await request(app).post(ROUTE).send({});
      });

      test('Then I expect it retuns status code 400', async () => {
        expect(response.status).toBe(400);
      });
    });

    describe('And no email is provided in the request body', () => {
      let response;
      beforeAll(async () => {
        response = await request(app).post(ROUTE).send({});
      });

      test('Then I expect it retuns status code 400', async () => {
        expect(response.status).toBe(400);
      });
    });

    describe('And no password is provided in the request body', () => {
      let response;
      beforeAll(async () => {
        response = await request(app).post(ROUTE).send({});
      });

      test('Then I expect it retuns status code 400', async () => {
        expect(response.status).toBe(400);
      });
    });

    describe('And invalid credentials are provided', () => {
      let response;
      const requestBody = makeRequestBody();
      beforeAll(async () => {
        response = await request(app).post(ROUTE).send(requestBody);
      });

      test('Then I expect it retuns status code 401', async () => {
        expect(response.status).toBe(401);
      });
    });

    describe('And valid credentials are provided', () => {
      let response;
      const profileFake = ProfileDataFaker.getProfile();
      const requestBody = makeRequestBody(profileFake);
      beforeAll(async () => {
        await DynamodbClient.put({
          TableName: TASK_MANAGER_TABLE_NAME,
          Item: profileFake
        });
        response = await request(app).post(ROUTE).send(requestBody);
      });

      test('Then I expect it retuns statud code 200', async () => {
        expect(response.status).toBe(200);
      });

      test('Then I expect it returns the body with expected fields and types', async () => {
        expect(response.body).toEqual({
          id: expect.any(String),
          email: expect.any(String),
          accessToken: expect.any(String)
        });
      });
    });
  });
});
