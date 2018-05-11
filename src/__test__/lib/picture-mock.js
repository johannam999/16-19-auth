'use strict';

import faker from 'faker';
import { pCreateAccountMock } from '../lib/account-mock';
import Picture from '../../model/picture';
import Account from '../../model/account'; // we cant create a pic without account

const pCreatePictureMock = () => {
  const resultMock = {};
  return pCreateAccountMock()
    .then((mockAccResponse) => { // this continues from account mock .then return mock
      resultMock.accountMock = mockAccResponse;

      return new Picture({
        pictureTitle: faker.lorem.words(5),
        url: faker.random.image(),
        account: resultMock.accountMock.account._id, // this is a result of
      }).save(); // it returns a promise, we can nest it here with .then but we prefer not
    })
    .then((picture) => {
      // console.log(picture);
      resultMock.picture = picture;
      return resultMock;// this has not just the picture but also token, account etc
    });
};

const pRemovePictureMock = () => Promise.all([Account.remove({}), Picture.remove({})]);

export { pCreatePictureMock };
