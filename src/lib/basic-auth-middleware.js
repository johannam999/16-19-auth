'use strict';

import HttpError from 'http-errors';
import Account from '../model/account';


// request, response, next are required arguments for middleware
export default(request, response, next) => {
  // this is an object
  if (!request.headers.authorization) { // if header doesnt have authorization field,
    return next(new HttpError(400, 'AUTH - invalid request'));
  }
  const base64AuthHeader = request.headers.authorization.split('Basic ')[1]; 
  if (!base64AuthHeader) {
    return next(new HttpError(400, 'Auth - invalid request'));
  }
  
  const stringAuthHeader = Buffer.from(base64AuthHeader, 'base64').toString();

  const [username, password] = stringAuthHeader.split(':'); // ;
  if (!username || !password) {
    return next(new HttpError(400, 'Auth - invalid request'));
  }
  // here we have a password and a username
  return Account.findOne({ username }) // find by username bc its unique
    .then((account) => {
      if (!account) {
        return next(new HttpError(400, 'Auth - invalid request'));
      }
      return account.pVerifyPassword(password); /*
 goes to account model, rehash the password
         and compare to hash
*/
    })
    .then((account) => { // here i have correct account
      request.account = account; // mutate the object and add property account on it
      // we dont need to return account bc its attached to request.body
      return next(); // next will go to a auth-router.js => authrouter.get
      // basicAuthMiddleware(this is what we did here)
    })
    .catch(next);
};

// hook up stuff in account.js

