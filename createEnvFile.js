import fs from 'fs';

const fileContent =
  'DB_HOST= //Connection string to MongoDB\n' +
  'LOGGING=true //Boolean value to allow general logging\n' +
  'VERBOSE=false //Boolean value to allow for verbose error logging from the endpoints\n' +
  'REACT_APP_SERVER_HOST=localhost //URL to where the server is hosted, defaults to `localhost`\n' +
  'REACT_APP_SERVER_PORT=8080 //Port to run the endpoints on, defaults to `8080`\n' +
  'API_KEY= //API key for TMDB to get recommendations. Can be acquired [here](https://developers.themoviedb.org/3/getting-started/introduction)\n' +
  'DB_NAME=mydb //Name of Mongo database to be used, defaults to `mydb`\n' +
  'COLLECTION=movies //Collection to be used in the Mongo database, defaults to `movies`';

function createEnvFile() {
  if (!fs.existsSync('.env')) {
    try {
      fs.writeFileSync('.env', fileContent, (e) => {
        if (e) {
          console.log('Error creating .env file');
          console.log(e.message);
        } else console.log('.env file succesfully created');
      });
    } catch (e) {
      console.log('Error creating .env file');
      console.log(e.message);
    }
  } else console.log('.env file already exists');
}

createEnvFile();
