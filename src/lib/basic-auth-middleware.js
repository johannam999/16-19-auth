'use strict';

import HttpError from 'http-errors';
import Account from '../model/account';


// request, response, next are required arguments for middleware
export default(request, response, next) => {
  if (!request.headers.authorization) {
    return next(new HttpError(400, 'AUTH - invalid request'));
  }
  const base64AuthHeader = request.headers.authorization.split('Basic ')[1]; 
  if (!base64AuthHeader) {
    return next(new HttpError(400, 'Auth - invalid request'));
  }
 
  const stringAuthHeader = Buffer.from(base64AuthHeader, 'base64').toString();
  // const usernamePassword = stringAuthHeader.split(':');
  // u can do the same with ES6:, this is destructuring array
  const [username, password] = stringAuthHeader.split(':');
  if (!username || !password) {
    return next(new HttpError(400, 'Auth - invalid request'));
  }
  // here we have a password and a username
  return Account.findOne({ username })
    .then((account) => {
      if (!account) {
        return next(new HttpError(400, 'Auth - invalid request'));
      }
      return account.pVerifyPassword(password);
    })
    .then((account) => { 
      request.account = account; 
      return next();
    })
    .catch(next);
};

