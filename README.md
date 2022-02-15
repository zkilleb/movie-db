# Movie Database Application

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
- LOGGING - Boolean value to allow general logging
- VERBOSE - Boolean value to allow for verbose error logging from the endpoints
- REACT_APP_SERVER_HOST - URL to where the server is hosted, defaults to `localhost`
- REACT_APP_SERVER_PORT - Port to run the endpoints on, defaults to `8080`
- API_KEY - API key for TMDB to get recommendations
  - Can be acquired [here](https://developers.themoviedb.org/3/getting-started/introduction)
- DB_NAME - Name of Mongo database to be used, defaults to `mydb`
- COLLECTION - Collection to be used in the Mongo database, defaults to `movies`

### MongoDB

Expects a database named `mydb` with a collection named `movies` if none of the optional enviornment variables are used
