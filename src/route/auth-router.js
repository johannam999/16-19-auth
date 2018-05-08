'use strict';

import { Router } from 'express'; // interview keywords : de-structuring and module
import { json } from 'body-parser';
import Account from '../model/account';
import logger from '../lib/logger';

const jsonParser = json();
const authRouter = new Router();

authRouter.post('/signup', jsonParser, (request, response, next) => {
  return Account.create(request.body.username, request.body.email, request.body.password)
    .then((account) => {
      delete request.body.password;
      logger.log(logger.INFO, 'AUTH - creating token');
      return account.pCreateToken();
    })
    .then((token) => {
      logger.log(logger.INFO, 'AUTH - returning 200 code and a token');
      return response.json({ token });
    })
    .catch(next);
});

export default authRouter;
