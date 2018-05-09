'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { pCreateAccountMock } from './lib/account-mock';
import { pRemoveProfileMock } from './lib/profile-mock';
import faker from 'faker';


const apiURL = `http://localhost:${process.env.PORT}`;

describe('POST /profiles', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(pRemoveProfileMock);

  test('POST /profiles, should get 200 if no errors and new profile', () => {
    let accountMock = null;
    return pCreateAccountMock() 
      .then((accountSetMock) => {
        accountMock = accountSetMock;
        return superagent.post(`${apiURL}/profiles`)
          .set('Authorization', `Bearer ${accountSetMock.token}`)
          .send({
            zipCode: '981094',
            nickname: 'joanna',
            category: 'birds',
          });
      })
    // we are testing accountSetMock but its only available 
    // in different scope so we need to create new let in our scope
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.account).toEqual(accountMock.account._id.toString());
        expect(response.body.nickname).toEqual('joanna');
        expect(response.body.zipCode).toEqual('981094');
        expect(response.body.category).toEqual('birds');
      });
  });
  // test(' 400 if no email', () => {
  //   return superagent.post(`${apiURL}/profiles`)
  //     .send({
  //         zipCode: '981094',
  //         nickname: 'joanna',
  //         category: 'birds',
  //     })
  //     .then(Promise.reject)
  //     .catch((err) => {
  //       expect(err.status).toEqual(400);
  //     });
  // });
});
