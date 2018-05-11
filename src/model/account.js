'use strict';

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';// to generate hash
import crypto from 'crypto';// to generate random data
import jsonWebToken from 'jsonwebtoken';
import HttpError from 'http-errors';


const HASH_ROUNDS = 8;  

const TOKEN_SEED_LENGTH = 128; // how long the token will be, random number of bytes

const accountSchema = mongoose.Schema({

  passwordHash: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  tokenSeed: {
    type: String,
    required: true,
    unique: true,
  },
  createdOn: {
    type: Date,
    default: () => new Date(),
  },   
});

function pVerifyPassword(password) {
  return bcrypt.compare(password, this.passwordHash)
    .then((result) => {
      if (!result) {
        throw new HttpError(400, 'AUTH - incorrect data');
      }
      return this;
    });
}
function pCreateToken() {
  this.tokenSeed = crypto.randomBytes(TOKEN_SEED_LENGTH).toString('hex');
  return this.save()
    .then((account) => {
      // we have a token seed, sign === encrypt
      return jsonWebToken.sign( // this line returns a promise that resolves a token
        { tokenSeed: account.tokenSeed },
        process.env.PICS_SECRET_PASS,
      ); // when this promise resolves i have a token
    });
}
accountSchema.methods.pCreateToken = pCreateToken;
accountSchema.methods.pVerifyPassword = pVerifyPassword;

const Account = mongoose.model('account', accountSchema);

/* Hash variables:
    - SALT
    - Hashing algo (bcrypt)
    - password
    - rounds
 */

Account.create = (username, email, password) => {
  return bcrypt.hash(password, HASH_ROUNDS)// here starts SALT
    .then((passwordHash) => {
      // here we have password hash
      password = null;
      const tokenSeed = crypto.randomBytes(TOKEN_SEED_LENGTH).toString('hex');// hex is used bc of http
      return new Account({
        username,
        email,
        passwordHash,
        tokenSeed,
      }).save();
    });
};

export default Account;
