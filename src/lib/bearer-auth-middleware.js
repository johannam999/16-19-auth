import HttpError from 'http-errors';
import jsonWebToken from 'jsonwebtoken';
import Account from '../model/account';

const promisify = callbackStyleFunction => (...args) => { 
  // we can have any amount of arguments using spread syntax 
  // bc we dont know which function we want to run, it gives back an array-like,
  // we have 2 arguments
  // fn is a  function we want to promisify
  // set of the arguments of the original function
  // console.log('hound', 'is, 'cute')
  
  return new Promise((resolve, reject) => {
    callbackStyleFunction(...args, (error, data) => {
      if (error) {
        return reject(error);// going to the next .catch if error
      }
      return resolve(data);// going to the next .then
    }); // destructuring args
  });
};
  // if (...args) inside the function call then we mean arguments
  // if inside function we mean array values
  
export default (request, response, next) => {
  if (!request.headers.authorization) {
    return next(new HttpError(400, 'AUTH - invalid request'));
  }
  const token = request.headers.authorization.split('Bearer ')[1];
  if (!token) {
    return next(new HttpError(400, 'AUTH - invalid request'));// sending naked token
  }
  return promisify(jsonWebToken.verify)(token, process.env.PICS_SECRET_PASS) 
  // here is token and secret, token and process... are callback(... args)
    .catch((error) => {
      return Promise.reject(new HttpError(400, `AUTH - jsonwebtoken Error ${error}`));
    }) // if theres a problem in the promisify we can have catch
    .then((decryptedToken) => {
      return Account.findOne({ tokenSeed: decryptedToken.tokenSeed }); // we are getting token seed
    })// finding token seed
    .then((account) => {
      if (!account) {
        return next(new HttpError(400, 'AUTH - invalid request'));
      }
      request.account = account;
      return next();
    })
    .catch(next);
};
