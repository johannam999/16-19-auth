'use strict';


import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { pCreatePictureMock, pRemovePictureMock } from './lib/picture-mock';
import logger from '../lib/logger';

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
    test('POST /pictures should return a 400 status code for bad request', () => {
      return pCreatePictureMock()
        .then(() => {
          return superagent.post(`${apiURL}/pictures`)
            .send({});
        })
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(400);
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
      let picTest = null;
      return pCreatePictureMock()
        .then((picture) => {
          picTest = picture;
          return superagent.get(`${apiURL}/pictures/${picture.picture._id}`)
            .set('Authorization', `Bearer ${picture.accountMock.token}`);
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.token).toBeTruthy();
        })
        .catch((err) => {
          logger.log(logger.ERROR, err);
        });
    });

    test('GET /pictures should return a 400 status code for no id', () => {
      return pCreatePictureMock()
        .then(() => {
          return superagent.post(`${apiURL}/pictures/`);
        })
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(400);
        });
    });

    test('GET /pictures should return a 404 status code for missing token', () => {
      return pCreatePictureMock()
        .then((picture) => {
          return superagent.post(`${apiURL}/pictures/${picture.picture._id}`)
            .set('Authorization', 'Bearer ');
        })
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(404);
        });
    });
  });
  describe('DELETE', () => {
    test('DEL /pictures/:id should respond with 204 if delete completed', () => {
      return pCreatePictureMock()
        .then((pictureMock) => {
          return superagent.delete(`${apiURL}/pictures/${pictureMock.picture._id}`)
            .set('Authorization', `Bearer ${pictureMock.accountMock.token}`);
        })
        .then((response) => {
          expect(response.status).toEqual(204);
        });
    });
    test('DEL /pictures/:id should respond with 404 if no picture exists', () => {
      return superagent.delete(`${apiURL}/pictures/wrongId`)
        .then(Promise.reject)
        .catch((error) => {
          expect(error.status).toEqual(404);
        });
    });
    test('DEL /pictures/:id should respond with 401 if bad token', () => {
      return pCreatePictureMock()
        .then((pictureMock) => {
          return superagent.delete(`${apiURL}/pictures/${pictureMock.picture._id}`)
            .set('Authorization', 'Bearer ');
        })
        .then(Promise.reject)
        .catch((error) => {
          expect(error.status).toEqual(401);
        });
    });
  });
});
