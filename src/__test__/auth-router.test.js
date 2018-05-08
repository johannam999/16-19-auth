'use strict';

import faker from 'faker';
import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { pCreateAccountMock, pRemoveAccountMock } from './lib/account-mock';


const apiURL = `http://localhost:${process.env.PORT}/signup`;

describe(' AUTH ROUTER', () => {
  beforeAll(startServer);
  afterAll(stopServer);

  test('POST should return a 200 status code and a token', () => {
    return superagent.post(apiURL)
      .send({
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.lorem.words(5),
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.token).toBeTruthy();
      });
  });
  test(' 400 if empty object', () => {
    return superagent.post(apiURL)
      .send({
        username: faker.internet.userName(),
        password: faker.lorem.words(5),
      })
      .then(Promise.reject)
      .catch((err) => {
        expect(err.status).toEqual(400);
      });
  });
  test('409 due to duplicate firstName', () => {
    return superagent.post(apiURL)
      .send({
        username: 'joanna',
        email: 'joanna@joanna.com',
        password: 'bum',
      })
      .then(() => {
        return superagent.post(apiURL)
          .send({
            username: 'joanna',
            email: 'joanna@joanna.com',
            password: 'nauka',
          });
      })
      .then(Promise.reject)
      .catch((err) => {
        expect(err.status).toEqual(409);
      });
  });
});
