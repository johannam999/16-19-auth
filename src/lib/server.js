'use strict';

import express from 'express';
import mongoose from 'mongoose';
import logger from './logger';
import authRoutes from '../route/auth-router';
import loggerMiddleware from './logger-middleware';
import errorMiddleware from './error-middleware';

const app = express(); // assign express to app =server
let server = null;

// app.use(loggerMiddleware)

app.use(loggerMiddleware); // call method use so express can access routes
app.use(authRoutes);
// if the app.use wont find the routes it will send it to error-middleware
app.all('*', (request, response) => { // built-in method
  logger.log(logger.INFO, 'Returning a 404 from the catch-all/default route');
  return response.sendStatus(404);
}); // catch all route, shows error if no route registered

app.use(errorMiddleware);// this error is from .catch(next)

const startServer = () => {
  return mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      server = app.listen(process.env.PORT, () => {
        logger.log(logger.INFO, `Server is listening on port ${process.env.PORT}`);
      });
    });   
};

const stopServer = () => { 
  return mongoose.disconnect() 
    .then(() => {
      server.close(() => {
        logger.log(logger.INFO, 'Server is off'); // we can add json.strigify here to see the error
      });
    });
};

// server turns on and off right after executing the test

export { startServer, stopServer };
