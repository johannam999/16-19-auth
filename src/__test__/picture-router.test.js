'use strict';

import faker from 'faker';
import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { pCreatePictureMock, pRemovePictureMock } from './lib/picture-mock';

const apiURL = `http://localhost:${process.env.PORT}`;

describe('TESTING ROUTES at /pictures', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(pRemovePictureMock);

  describe('POST 200 for successful post to /pictures', () => {
    test(' should return 200', () => {
      return pCreatePictureMock()
        .then((mockResponse) => {
          const { token } = mockResponse.accountMock;
          return superagent.post(`${apiURL}/pictures`)
            .set('Authorization', `Bearer ${token}`)
            .field('pictureTitle', 'whiteboard 1')
            .attach('picture', `${__dirname}/asset/whiteboard.jpg`)
            .then((response) => {
              expect(response.status).toEqual(200);
              expect(response.body.pictureTitle).toEqual('whiteboard 1');
              expect(response.body._id).toBeTruthy();
              expect(response.body.url).toBeTruthy();
            });
        })
        .catch((response) => { 
          expect(response.status).toEqual(200);
        });
    });
    test('should return 401 when no token given', () => {
      const toTest = {
        pictureTitle: faker.lorem.words(5),
        url: faker.random.image(),
      }
        .then((toTest) => {
          return superagent.post(`${apiURL}/pictures`)
            .set('Authorization', `Bearer ${token}`)
            .send(toTest);
        })
        .then(Promise.reject)

        .catch((response) => {
          expect(response.status).toEqual(400);
        });
    });

    test('should return 401 when no token given', () => {
      return pCreatePictureMock()
        .then(() => {
          return superagent.post(`${apiURL}/pictures`)
            .set('Authorization', 'Bearer ')
            .send({});
        })
        .then(Promise.reject)
      
        .catch((response) => { 
          expect(response.status).toEqual(401);
        });
    });
  });
  describe('GET 200 for successful get to /pictures/:id', () => {
    test(' should return 200', () => {
      let testPic = null;
      return pCreatePictureMock()
        .then((mockPic) => {
          console.log(mockPic.accountMock.account._id);
          testPic = mockPic.accountMock.account._id;
          const { token } = mockPic.accountMock;
          return superagent.get(`${apiURL}/pictures/${mockPic.accountMock._id}`)
            .set('Authorization', `Bearer ${token}`)
            .attach('picture', `${__dirname}/asset/whiteboard.jpg`)
            .then((response) => {
              console.log(response.body._id);
              expect(response.status).toEqual(200);
              // expect(response.body._id).toEqual(testPic._id.toString())
            });
        });
    });
  });
});
