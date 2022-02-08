import express from 'express';
import dotenv from 'dotenv';
import {
  getTitles,
  getDirector,
  getTitleById,
  getRandomTitle,
  addMovie,
  editMovie,
  deleteMovie,
  getTMDBKeyword,
  getTMDBKeywordByPerson,
  getRecommendations,
  getReview,
  getActor,
  addRelease,
  deleteRelease,
} from './controllers.js';

dotenv.config();

const app = express();
const port = process.env.SERVER_PORT || 8080;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

app.get('/titles/:title', getTitles);

app.get('/director/:name', getDirector);

app.get('/actor/:name', getActor);

app.get('/title/id/:id', getTitleById);

app.get('/random-title', getRandomTitle);

app.post('/add/title', addMovie);

app.put('/edit/title', editMovie);

app.delete('/title/:id', deleteMovie);

app.get('/keyword-search/:keyword', getTMDBKeyword);

app.get('/person-search/:keyword/:type', getTMDBKeywordByPerson);

app.get('/recommendations/:id', getRecommendations);

app.get('/review/:title/:year', getReview);

app.put('/add/release', addRelease);

app.put('/delete/release', deleteRelease);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
