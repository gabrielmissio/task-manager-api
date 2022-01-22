const ROUTE = '/login';
const request = require('supertest');

const app = require('../../../src/main/confing/app');
const { DataFakerHelper } = require('../../helpers');

const makeRequestBody = () => ({
  email: DataFakerHelper.getEmail(),
  password: DataFakerHelper.getPassword()
});

describe(`Given the ${ROUTE} route`, () => {
  describe('And a POST request is performed', () => {
    describe('And no parameters provided in the request body', () => {
      let response;
      beforeAll(async () => {
        response = await request(app).post(ROUTE).send({});
      });

      test('Then I expect it retuns statud code 400', async () => {
        expect(response.status).toBe(400);
      });
    });

    describe('And no email is provided in the request body', () => {
      let response;
      beforeAll(async () => {
        response = await request(app).post(ROUTE).send({});
      });

      test('Then I expect it retuns statud code 400', async () => {
        expect(response.status).toBe(400);
      });
    });

    describe('And no password is provided in the request body', () => {
      let response;
      beforeAll(async () => {
        response = await request(app).post(ROUTE).send({});
      });

      test('Then I expect it retuns statud code 400', async () => {
        expect(response.status).toBe(400);
      });
    });

    describe('And invalid credentials are provided', () => {
      let response;
      const requestBody = makeRequestBody();
      beforeAll(async () => {
        response = await request(app).post(ROUTE).send(requestBody);
      });

      test('Then I expect it retuns statud code 401', async () => {
        expect(response.status).toBe(401);
      });
    });
  });
});
