'use strict';

import logger from './logger';

export default(error, request, response, next) => { // this is express convention
  // eslint-disable-line no-unused-vars
  logger.log(logger.ERROR, '__ERROR_MIDDLEWARE__');
  logger.log(logger.ERROR, error);
  // i know i have the property error.status
  if (error.status) { // checking if the message has a status if not run the error,
    logger.log(logger.INFO, `Responded with a ${error.status} code and message ${error.message}`);
    return response.sendStatus(error.status);
  }// i know that if we are here its another type or error
  const errorMessage = error.message.toLowerCase();
  
  if (errorMessage.includes('objectid failed')) {
    logger.log(logger.INFO, ' Responding with a 404 code');// this is not a server problem its their problem
    return response.sendStatus(404);
  }
  if (errorMessage.includes('validation failed')) {
    logger.log(logger.INFO, ' Responding with a 400 code');// this is not a server problem its their problem
    return response.sendStatus(400);
  }
  if (errorMessage.includes('duplicate key')) { // duplicate values
    logger.log(logger.INFO, ' Responding with a 409 code');// this is not a server problem its their problem
    return response.sendStatus(409);
  }
  if (errorMessage.includes('unauthorized ')) { // no password
    logger.log(logger.INFO, ' Responding with a 401 code');// this is not a server problem its their problem
    return response.sendStatus(401);
  }
  logger.log(logger.ERROR, 'Responded with a 500 error code');
  logger.log(logger.ERROR, error);
  return response.sendStatus(500);
};
// we never put next here, we can but we dont
