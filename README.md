# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Running the application

### `npm start`

Starts the frontend for the application

### `npm start:backend`

Starts the backend with node

### `npm start:backend:dev`

Starts the backend with nodemon for development

### Environment variables

Create `.env` file in the top level directory with the following variables

- DB_HOST - Connection string to MongoDB
- VERBOSE - Boolean value to allow for verbose logging from the endpoints
- SERVER_PORT - Port to run the endpoints on
- API_KEY - API key for TMDB to get recommendations
  - Can be acquired [here](https://developers.themoviedb.org/3/getting-started/introduction)
- Optional: DB_NAME - Name of Mongo database to be used
- Optional: COLLECTION - Collection to be used in the Mongo databse

### MongoDB

Expects a database named `mydb` with a collection named `movies` if not of the optional enviornment variables are used
