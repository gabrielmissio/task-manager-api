const { ProfileFactory } = require('../../../../../../src/infra/db/dynamodb/factories');
const { ProfileDataFaker } = require('../../../../../helpers');

const makeSut = () => {
  const sut = ProfileFactory;
  return { sut };
};

describe('Given the ProfileFactory', () => {
  describe('Given the buildProfile method', () => {
    test('Then I expect it returns the id field with the value obtained from the PK field after removing the #USER substring', () => {
      const { sut } = makeSut();
      const profileFake = ProfileDataFaker.getProfile();
      const response = sut.buildProfile(profileFake);
      expect(response.id).toBe(profileFake.PK.replace('USER#', ''));
    });
  });
});
