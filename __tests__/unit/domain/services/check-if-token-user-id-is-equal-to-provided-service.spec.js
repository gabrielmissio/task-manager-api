const { MissingParamError } = require('../../../../src/utils/errors');
const { DataFakerHelper } = require('../../../helpers');

class CheckIfTokenUserIdIsEqualToProvidedService {
  constructor({ tokenDecoder } = {}) {
    this.tokenDecoder = tokenDecoder;
  }

  handler({ userId, token }) {
    if (!userId) throw new MissingParamError('userId');
    if (!token) throw new MissingParamError('token');

    const tokenPayload = this.tokenDecoder.decode({ token });
    const tokenUserId = tokenPayload && tokenPayload.userId;
    const isEqual = tokenUserId && tokenUserId === userId;

    return isEqual;
  }
}

const makeTokenDecoderSpy = () => {
  class TokenDecoderSpy {
    decode({ token }) {
      this.params = token;
      return this.response;
    }
  }

  return new TokenDecoderSpy();
};

const makeTokenDecoderSpyWithError = () => {
  class TokenDecoderSpyWithError {
    decode() {
      this.error = DataFakerHelper.getSentence({ words: 3 });
      throw new Error(this.error);
    }
  }

  return new TokenDecoderSpyWithError();
};

const makeSut = () => {
  const tokenDecoderSpy = makeTokenDecoderSpy();

  const sut = new CheckIfTokenUserIdIsEqualToProvidedService({ tokenDecoder: tokenDecoderSpy });

  return {
    sut,
    tokenDecoderSpy
  };
};

describe('Given the CheckIfTokenUserIdIsEqualToProvidedService', () => {
  describe('And no userId is provided', () => {
    test('Then I expect it throws a new MissingParamError', () => {
      const { sut } = makeSut();
      const params = {};
      const response = () => sut.handler(params);

      expect(response).toThrow(new MissingParamError('userId'));
    });
  });

  describe('And no token is provided', () => {
    test('Then I expect it throws a new MissingParamError', () => {
      const { sut } = makeSut();
      const params = { userId: 'any_id' };
      const response = () => sut.handler(params);

      expect(response).toThrow(new MissingParamError('token'));
    });
  });

  describe('And the tokenDecoder dependency is not injected', () => {
    test('Then I expect it throws an error', () => {
      const sut = new CheckIfTokenUserIdIsEqualToProvidedService();
      const params = {
        userId: 'any_email',
        token: 'any_token'
      };

      const response = () => sut.handler(params);

      expect(response).toThrow(new Error("Cannot read property 'decode' of undefined"));
    });
  });

  describe('And the tokenDecoder dependency has not decode method', () => {
    test('Then I expect it throws an error', () => {
      const sut = new CheckIfTokenUserIdIsEqualToProvidedService({ tokenDecoder: {} });
      const params = {
        userId: 'any_email',
        token: 'any_token'
      };

      const response = () => sut.handler(params);

      expect(response).toThrow(new Error('this.tokenDecoder.decode is not a function'));
    });
  });

  describe('And the tokenDecoder dependency is injected and has decode method', () => {
    test('Then I expect it calls decode method of tokenDecoder  dependency with the expected params', () => {
      const { sut, tokenDecoderSpy } = makeSut();
      const params = {
        userId: 'any_id',
        token: DataFakerHelper.getString()
      };

      sut.handler(params);

      expect(tokenDecoderSpy.params).toBe(params.token);
    });
  });

  describe('And the decode method of tokenDecoder dependency throws an error', () => {
    test('Then I expect it throws an error', () => {
      const tokenDecoderSpyWithError = makeTokenDecoderSpyWithError();
      const sut = new CheckIfTokenUserIdIsEqualToProvidedService({ tokenDecoder: tokenDecoderSpyWithError });
      const params = {
        userId: 'any_id',
        token: 'any_token'
      };

      const response = () => sut.handler(params);

      expect(response).toThrow(tokenDecoderSpyWithError.error);
    });
  });

  describe('And the decode method of tokenDecoder dependency does not return the userId property', () => {
    test('Then I expect it returns null', () => {
      const { sut, tokenDecoderSpy } = makeSut();
      tokenDecoderSpy.response = {};
      const params = {
        userId: 'any_id',
        token: 'any_token'
      };

      const response = sut.handler(params);

      expect(response).toBeFalsy();
    });
  });

  describe('And the decode method of tokenDecoder dependency returns an userId', () => {
    test('Then I expect it returns the result of the comparison between the token userId and the provided userId', () => {
      const { sut, tokenDecoderSpy } = makeSut();
      const params = {
        userId: DataFakerHelper.getUUID(),
        token: DataFakerHelper.getString()
      };
      tokenDecoderSpy.response = { userId: params.userId };
      const resultMatches = sut.handler(params);

      expect(resultMatches).toBeTruthy();

      tokenDecoderSpy.response = { userId: 'any_userId' };
      const resultDoesNotMatches = sut.handler(params);

      expect(resultDoesNotMatches).toBeFalsy();
    });
  });
});
