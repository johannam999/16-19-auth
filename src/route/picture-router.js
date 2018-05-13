'use strict';

import multer from 'multer';
import { Router } from 'express';
import HttpError from 'http-errors';
import bearerAuthMiddleWare from '../lib/bearer-auth-middleware';
import Picture from '../model/picture';
import { s3Upload, s3Remove } from '../lib/s3';
//import { pCreatePictureMock } from '../__test__/lib/picture-mock';

const multerUpload = multer({ dest: `${__dirname}/../temp` });
 
const pictureRouter = new Router();

pictureRouter.post('/pictures', bearerAuthMiddleWare, multerUpload.any(), (request, response, next) => {
  if (!request.account) {
    return next(new HttpError(404, 'PICTURE ROUTER _ERROR_, not found'));
  }
  if (!request.body.pictureTitle || request.files.length > 1 || request.files[0].fieldname !== 'picture') {
    return next(new HttpError(400, 'PICTURE ROUTER __ERROR__ invalid request'));
  }

  const file = request.files[0];
  const key = `${file.filename}.${file.originalname}`;

  return s3Upload(file.path, key) // path property from file
    .then((url) => {
      return new Picture({
        pictureTitle: request.body.pictureTitle,
        account: request.account._id, 
        url,
      }).save();
    })
    .then(picture => response.json(picture))
    .catch(next);
});

pictureRouter.get('/pictures/:id', bearerAuthMiddleWare, (request, response, next) => {
  if (!request.params.id) {
    return next(new HttpError(400, 'PICTURE ROUTER _ERROR_, invalid request'));
  }
  return Picture.findById(request.params.id)
    .then((picture) => {
      if (!picture) {
        return next(new HttpError(404, 'PICTURE ROUTER _ERROR_, wrong id'));
      }
      return response.json(picture);
    })
    .catch(next);
});

pictureRouter.delete('/pictures/:id', bearerAuthMiddleWare, (request, response, next) => {
  return Picture.findByIdAndRemove(request.params.id)
    .then((picture) => {
      return s3Remove(picture.url);
    })
    .then(() => {
      return response.sendStatus(204);
    })
    .catch(next);
});

export default pictureRouter;
