'use strict';

import faker from 'faker';
import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { pCreateAccountMock } from './lib/account-mock';
import { pRemoveProfileMock, pCreateProfileMock } from './lib/profile-mock';


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
            nickname: 'joanna',
            zipCode: '981094',
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
  test('POST /profiles returns 404 if wrong id', () => {
    return pCreateAccountMock() 
      .then((accountSetMock) => {
        return superagent.post(`${apiURL}/profiles/wrongid`)
          .set('Authorization', `Bearer ${accountSetMock.token}`)
          .send({
            zipCode: faker.lorem.words(8),
            picture: faker.random.image(),
            nickname: faker.lorem.words(15),
          });
      })
      .then(Promise.reject)
      .catch((err) => {
        expect(err.status).toEqual(404);
      });
  });
  test('POST /profiles should show 400 if missing  token', () => {
    return pCreateAccountMock() 
      .then(() => {
        return superagent.post(`${apiURL}/profiles`)
          .set('Authorization', 'Bearer ')
          .send({
            zipCode: faker.lorem.words(8),
            picture: faker.random.image(),
            nickname: faker.lorem.words(15),
          });
      })
      .then(Promise.reject)
      .catch((err) => {
        expect(err.status).toEqual(400);
      });
  });


  test('GET /profiles/:id should respond with 200 if no errors', () => {
    let profileTest = null;
    return pCreateProfileMock()
      .then((profile) => {  
        profileTest = profile;
        return superagent.get(`${apiURL}/profiles/${profile.profile._id}`);
      })
      .then((response) => {
        expect(response.body.nickname).toEqual(profileTest.profile.nickname);
        expect(response.body.zipCode).toEqual(profileTest.profile.zipCode);
        expect(response.body.category).toEqual(profileTest.profile.category);
        expect(response.body._id).toBeTruthy();
      });
  });

  test('GET /profiles returns 404 if bad request ', () => {
    return superagent.get(`${apiURL}/profiles/`)
      .then(Promise.reject)
      .catch((err) => {
        expect(err.status).toEqual(404);
      });
  });
});
