# Project Name
**Author**: Joanna Coll
**Version**: 1.0.0 

## Overview

This app creates an account with login and a signup functionality for the user, using the best practice for authentication and autorization. 
The user uses a password which is sent to the server, where a hash password gets created (encoded user password) and the original user password deleted. 
The token seed gets created on server side and token on client side to keep the user logged in without sending password each time. 
From this moment user can access their account using just token until it expires.

## Getting Started

1. To start you need to download all the necessary dependencies and create all the directories.
2. Start with building Schema for the user Account.
3. Build a server and add start and stop routes.
4. Create initial test for server.
5. Write logger.js and export it.
6. Create error-middleware.js and error-middleware.js to handle errors and export it.
7. Make sure server listens on port 7000 in .env file. Write test for .env.
8. Create authentification routes POST, GET, PUT and DELETE.
9. Simultaneously write test for those routes.

## Architecture
JavaScript, Node.js, Airbnb package, babelrc, nodemon, mongodb, faker, http error, other dependencies

## Change Log

05-07-2018 7:00pm - The application is finished and tested.
05-13-2018 7:30pm - Finished writing README.md

## Credits and Collaborations

