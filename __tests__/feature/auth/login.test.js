const ROUTE = '/login';
const request = require('supertest');

const app = require('../../../src/main/confing/app');

describe(`Given the ${ROUTE} route`, () => {
  describe('And a POST request is performed', () => {
    describe('and no parameters provided in the request body', () => {
      let response;
      beforeAll(async () => {
        response = await request(app).post(ROUTE).send({});
      });

      test('Then I expect it retuns statud code 400', async () => {
        expect(response.status).toBe(400);
      });
    });

    describe('and no email is provided in the request body', () => {
      let response;
      beforeAll(async () => {
        response = await request(app).post(ROUTE).send({});
      });

      test('Then I expect it retuns statud code 400', async () => {
        expect(response.status).toBe(400);
      });
    });

    describe('and no password is provided in the request body', () => {
      let response;
      beforeAll(async () => {
        response = await request(app).post(ROUTE).send({});
      });

      test('Then I expect it retuns statud code 400', async () => {
        expect(response.status).toBe(400);
      });
    });
  });
});
