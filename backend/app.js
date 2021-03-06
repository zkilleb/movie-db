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
  getAllTitles,
  getAllReleases,
  deleteReleaseFromAll,
} from './controllers.js';
import { loggingMiddleware, configurationMiddleware } from './middleware.js';
import { host, port } from './constants.js';

dotenv.config();

const app = express();

app.use(loggingMiddleware);
app.use(configurationMiddleware);

app.get('/titles', getAllTitles);

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

app.put('/delete/release/:movieId/:releaseId', deleteReleaseFromAll);

app.get('/releases', getAllReleases);

app.listen(port, () => {
  console.log(`App listening at ${host}:${port}`);
});
