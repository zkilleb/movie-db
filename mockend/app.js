import express from 'express';
import {
  mockTitles,
  mockTitle,
  mockDirector,
  mockActor,
  mockTitleId,
  mockRandom,
  mockAddTitle,
  mockAllReleases,
  mockReview,
} from './handlers/mockTitles.js';
import { TMDB_RESULTS } from './data/tmdbResults.js';
import { RECOMMENDATIONS } from './data/recommendations.js';
import { configurationMiddleware } from './middleware.js';

let addedTitle = '';

const ADDED_ID = '0000000000';

const app = express();
app.use(configurationMiddleware);

app.get('/titles', (req, res) => {
  res.status(200).json(mockTitles());
});

app.get('/titles/:title', (req, res) => {
  res.status(200).json(mockTitle(req.params.title));
});

app.get('/director/:name', (req, res) => {
  if (req.params.name.length < 3) {
    res.status(400).json({ message: 'Invalid request' });
  } else {
    res.status(200).json(mockDirector(req.params.name));
  }
});

app.get('/actor/:name', (req, res) => {
  if (req.params.name.length < 3) {
    res.status(400).json({ message: 'Invalid request' });
  } else {
    res.status(200).json(mockActor(req.params.name));
  }
});

app.get('/title/id/:id', (req, res) => {
  if (req.params.id === ADDED_ID && addedTitle) {
    res.status(200).json(addedTitle);
  } else {
    res.status(200).json(mockTitleId(req.params.id));
  }
});

app.get('/random-title', (req, res) => {
  res.status(200).json(mockRandom());
});

app.post('/add/title', (req, res) => {
  const mockResult = mockAddTitle(req);
  if (!mockResult) {
    res.status(409).json({
      message: 'Record already exists',
    });
  }
  let doc = req.query;
  doc.insertedId = ADDED_ID;
  doc.releases = [];
  addedTitle = doc;
  res.status(200).send(doc);
});

app.put('/edit/title', (req, res) => {
  res.status(200).send(req.query);
});

app.delete('/title/:id', (req, res) => {
  res.status(200).json({ message: 'Record succesfully deleted' });
});

app.get('/keyword-search/:keyword', (req, res) => {
  res.send(TMDB_RESULTS);
});

app.get('/person-search/:keyword/:type', (req, res) => {
  res.send(TMDB_RESULTS);
});

app.get('/recommendations/:id', (req, res) => {
  res.send(RECOMMENDATIONS);
});

app.get('/review/:title/:year/:id', (req, res) => {
  res.status(200).send(mockReview());
});

app.put('/add/release', (req, res) => {
  res.status(200).send([
    {
      label: req.query.label,
      notes: req.query.releaseNotes,
      format: req.query.format,
      uuid: req.query.uuid,
    },
  ]);
});

app.put('/delete/release', (req, res) => {
  res.status(200).send(req.query.releases);
});

app.put('/delete/release/:movieId/:releaseId', (req, res) => {
  res.status(200).json({ message: 'Release succesfully deleted' });
});

app.get('/releases', (req, res) => {
  res.status(200).send(mockAllReleases());
});

app.put('/add/rating', (req, res) => {
  res.status(200).json({ message: 'Rating succesfully added' });
});

app.listen(8080, () => {
  console.log('Mockend listening at http://localhost:8080');
});
