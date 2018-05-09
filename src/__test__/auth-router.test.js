'use strict';

import faker from 'faker';
import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { pCreateAccountMock, pRemoveAccountMock } from './lib/account-mock';


const apiURL = `http://localhost:${process.env.PORT}`;

describe(' AUTH ROUTER', () => {
  beforeAll(startServer);
  afterAll(stopServer);

  test('POST should return a 200 status code and a token', () => {
    return superagent.post(`${apiURL}/signup`)
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
  test(' 400 if no email', () => {
    return superagent.post(`${apiURL}/signup`)
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
    return superagent.post(`${apiURL}/signup`)
      .send({
        username: 'joanna',
        email: 'joanna@joanna.com',
        password: 'bum',
      })
      .then(() => {
        return superagent.post(`${apiURL}/signup`)
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

  describe('GET /login', () => {
    test('GET /login should get a 200 status code and a token', () => {
      return pCreateAccountMock()
        .then((mock) => {
          return superagent.get(`${apiURL}/login`)
            .auth(mock.request.username, mock.request.password); // this line is important
        })
        .then((response) => {
          // when I login, I get a 200 status code and a token
          expect(response.status).toEqual(200);
          expect(response.body.token).toBeTruthy();
        });
    });
    test(' 400 if no password', () => {
      return superagent.get(`${apiURL}/login`)
        .send({
          username: faker.internet.userName(),
        })
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(400);
        });
    });
  });
});

//   test(' 404 if wrong password', () => {
//     return superagent.get(`${apiURL}/login`)
//       .send({
//         username: faker.internet.userName(),
//         password: 'bubu',
//       })
//       .then(Promise.reject)
//       .catch((err) => {
//         expect(err.status).toEqual(404);
//       });
//   });
// });
