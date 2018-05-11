'use strict';

import fs from 'fs-extra';

const s3Upload = (path, key) => {
  const aws = require('aws-sdk');
  const amazonS3 = new aws.S3(); 

  const uploadOptions = {
    Bucket: process.env.AWS_BUCKET,
    Key: key,
    ACL: 'public-read',
    Body: fs.createReadStream(path), // readable stream that comes in chunks
  };
  console.log('in middle of upload');
  return amazonS3.upload(uploadOptions) 
    .promise() 
    .then((response) => { 
      console.log('in .then of upload', response);
      return fs.remove(path)
        .then(() => response.Location) 
        
        .catch(err => Promise.reject(err));
    }) 
    .catch((err) => { // for other errors from amazon s3
      return fs.remove(path)
        .then(() => Promise.reject(err))
        .catch(fsErr => Promise.reject(fsErr));
    });
};
const s3Remove = (key) => {
  const aws = require('aws-sdk');
  const amazonS3 = new aws.S3();
  const removeOptions = {
    Key: key,
    Bucket: process.env.AWS_BUCKET,
  };
  return amazonS3.deleteObject(removeOptions).promise();
};

export { s3Upload, s3Remove }; 

