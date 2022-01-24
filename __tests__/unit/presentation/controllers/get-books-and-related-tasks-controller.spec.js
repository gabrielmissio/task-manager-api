const { MissingParamError } = require('../../../../src/utils/errors');
const { InternalServerError } = require('../../../../src/presentation/errors');
const { HttpResponse } = require('../../../../src/presentation/helpers');

class GetBooksAndRelatedTasksController {
  async handler() {
    try {
      throw new MissingParamError('params');
    } catch (error) {
      console.log(error);
      return HttpResponse.exceptionHandler(error);
    }
  }
}

const makeSut = () => {
  const sut = new GetBooksAndRelatedTasksController();

  return { sut };
};

describe('Given the GetBooksAndRelatedTasksController', () => {
  describe('And httpRequest has no params', () => {
    let response;
    beforeAll(async () => {
      const { sut } = makeSut();
      response = await sut.handler({});
    });
    test('Then I expect it returns statusCode 500', async () => {
      expect(response.statusCode).toBe(500);
    });
    test('Then I expect it returns the body with InternalServerError message', () => {
      expect(response.body).toEqual({ error: new InternalServerError().message });
    });
  });
});
