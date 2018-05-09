'use strict';

import faker from 'faker';
import Profile from '../../model/profile';
import { pCreateAccountMock, pRemoveAccountMock } from './account-mock';

const pCreateProfileMock = () => {
  const resultMock = {};

  return pCreateAccountMock()
    .then((accountSetMock) => { // mocking all the information (account, request, token)
      resultMock.accountSetMock = accountSetMock;

      return new Profile({
        zipCode: faker.lorem.words(8),
        picture: faker.random.image(), // this gives the address to pic
        nickname: faker.name.nickname(15),
        category: faker.name.category(),
        account: accountSetMock.account._id,
      }).save();
    })
    .then((profile) => {
      resultMock.profile = profile;
      return resultMock;
    });
};
const pRemoveProfileMock = () => {
  return Promise.all([
    Profile.remove({}),
    pRemoveAccountMock(),
  ]);
};

export { pCreateProfileMock, pRemoveProfileMock };
