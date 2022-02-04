const ROUTE = '/user/:userId/book';
const request = require('supertest');

const app = require('../../../src/main/confing/app');
const { AuthenticationHelper, DataFakerHelper } = require('../../helpers');

const getRoute = ({ userId } = { userId: ':userId' }) => ROUTE.replace(':userId', userId);
const authenticationHelper = new AuthenticationHelper();

jest.unmock('jsonwebtoken');
jest.unmock('bcryptjs');

describe(`Given the ${getRoute()} route`, () => {
  describe('And a GET request is performed', () => {
    describe('And no authorization header is provided', () => {
      let response;
      beforeAll(async () => {
        response = await request(app)
          .get(getRoute({ userId: 'any_userId' }))
          .send({});
      });

      test('Then I expect it retuns status code 401', async () => {
        expect(response.status).toBe(401);
      });
    });

    describe('And an invalid authorization header is provided', () => {
      let response;
      beforeAll(async () => {
        response = await request(app)
          .get(getRoute({ userId: 'any_userId' }))
          .set({ authorization: 'Bearer' })
          .send({});
      });

      test('Then I expect it retuns status code 401', async () => {
        expect(response.status).toBe(401);
      });
    });

    describe('And an invalid userId is provided', () => {
      let response;
      beforeAll(async () => {
        const token = await authenticationHelper.getAccessToken();
        const authorization = `Bearer ${token}`;

        response = await request(app)
          .get(getRoute({ userId: 'any_userId' }))
          .set({ authorization })
          .send({});
      });

      test('Then I expect it retuns status code 400', async () => {
        expect(response.status).toBe(400);
      });
    });

    describe('And a non-existing userId is provided', () => {
      let response;
      beforeAll(async () => {
        const token = await authenticationHelper.getAccessToken();
        const authorization = `Bearer ${token}`;

        response = await request(app)
          .get(getRoute({ userId: DataFakerHelper.getUUID() }))
          .set({ authorization })
          .send({});
      });

      test('Then I expect it retuns status code 404', async () => {
        expect(response.status).toBe(404);
      });
    });
  });
});
