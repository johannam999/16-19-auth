'use strict';

import HttpError from 'http-errors';
import Account from '../model/account';


// request, response, next are required arguments for middleware
export default(request, response, next) => {
  if (!request.headers.authorization) {
    return next(new HttpError(400, 'AUTH - invalid request'));
  }
  const base64AuthHeader = request.headers.authorization.split('Basic ')[1]; // base 64 information bc we want only the string without word base
  if (!base64AuthHeader) {
    return next(new HttpError(400, 'Auth - invalid request'));
  }
  // convert base64 to normal string, we get username: password
  const stringAuthHeader = Buffer.from(base64AuthHeader, 'base64').toString();
  // const usernamePassword = stringAuthHeader.split(':');
  // u can do the same with ES6:, this is destructuring array
  const [username, password] = stringAuthHeader.split(':');
  if (!username || !password) {
    return next(new HttpError(400, 'Auth - invalid request'));
  }
  // here we have a password and a username
  return Account.findOne({ username }) // find by username bc its unique
    .then((account) => {
      if (!account) {
        return next(new HttpError(400, 'Auth - invalid request'));
      }
      return account.pVerifyPassword(password);
    })
    .then((account) => { // here i have correct account
      request.account = account; // mutate the object and add property account on it
      return next();
    })
    .catch(next);
};

// hook up stuff in account.js

