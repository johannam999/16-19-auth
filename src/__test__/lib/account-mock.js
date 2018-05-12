'use strict';

import faker from 'faker';
import Account from '../../model/account';


const pCreateAccountMock = () => {
  const mock = {};
  mock.request = { 
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.lorem.words(5),
  };
  return Account.create(mock.request.username, mock.request.email, mock.request.password)
    .then((account) => {
      mock.account = account;
      return account.pCreateToken(); // this line changes the token Seed
    })// after creating token we send it below to ..then
    .then((token) => {
      mock.token = token;// token is the actual token
      // here, I know that account has changed (tokenSeed)
      // up to here we have object with 3 properties(request, account, token)
      return Account.findById(mock.account._id);
    })
    .then((account) => { // here we get account from the top
      mock.account = account;
      return mock;
    });// this continues to the auth-router.test.js POST . then ((account) => {
  //  const mockAccount...
  // })
};

const pRemoveAccountMock = () => Account.remove({});

export { pCreateAccountMock, pRemoveAccountMock };
