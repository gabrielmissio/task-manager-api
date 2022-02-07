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

    describe('And an existing userId is provided', () => {
      describe('And a not allowed request is performed', () => {
        let response;
        beforeAll(async () => {
          const token = await authenticationHelper.getAccessToken();
          const authorization = `Bearer ${token}`;

          await authenticationHelper.createNewUser();
          const userFake = await authenticationHelper.getUser();
          response = await request(app)
            .get(getRoute({ userId: userFake.profile.PK.replace('USER#', '') }))
            .set({ authorization })
            .send({});
        });

        test('Then I expect it retuns status code 403', async () => {
          expect(response.status).toBe(403);
        });
      });

      describe('And an allowed request is performed', () => {
        describe('And the provided user has at least one book and task', () => {
          let response;
          beforeAll(async () => {
            const token = await authenticationHelper.getAccessToken();
            const authorization = `Bearer ${token}`;

            const userFake = await authenticationHelper.getUser();
            response = await request(app)
              .get(getRoute({ userId: userFake.profile.PK.replace('USER#', '') }))
              .set({ authorization })
              .send({});
          });

          test('Then I expect it retuns status code 200', async () => {
            expect(response.status).toBe(200);
          });

          test('Then I expect it returns the body with expected fields and types', async () => {
            expect(response.body).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  id: expect.any(String),
                  title: expect.any(String),
                  description: expect.any(String),
                  createdAt: expect.any(String),
                  tasks: expect.arrayContaining([
                    expect.objectContaining({
                      id: expect.any(String),
                      description: expect.any(String),
                      isDone: expect.any(Boolean),
                      createdAt: expect.any(String)
                    })
                  ])
                })
              ])
            );
          });
        });
      });
    });

    // TODO: add test to ensure returns an empty array when the provided userId does not have any book or task
  });
});
