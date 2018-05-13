'use strict';

import { json } from 'body-parser';
import { Router } from 'express';
import HttpError from 'http-errors';
import Profile from '../model/profile';
import bearerAuthMiddleware from '../lib/bearer-auth-middleware';
import logger from '../lib/logger';

const jsonParser = json();
const profileRouter = new Router();

profileRouter.post('/profiles', bearerAuthMiddleware, jsonParser, (request, response, next) => {
  if (!request.account) {
    return next(new HttpError(400, 'AUTH - invalid request'));
  }

  return new Profile({
    ...request.body, // destructuring the object it all the properties needed
    account: request.account._id,
  })
    .save()
    .then((profile) => {
      logger.log(logger.INFO, 'Returning a 200 and a new Profile');
      return response.json(profile);
    })
    .catch(next);
});

profileRouter.get('/profiles/:id', (request, response, next) => {
  if (!request.params.id) {
    logger.log(logger.INFO, 'GET - responding with 400 status code - no id provided');
    return next(new HttpError(400, 'GET - invalid request'));
  }
  return Profile.findById(request.params.id)
    .then((profile) => {
      if (!profile) {
        logger.log(logger.INFO, 'GET - responding with a 404 status code - no id');
        return next(new HttpError(404, 'AUTH - bad id'));
      }
      logger.log(logger.INFO, 'Returning 200 and a  profile'); 
      return response.json(profile);
    })
    .catch(next);
});
  
export default profileRouter;
