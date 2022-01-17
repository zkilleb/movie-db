import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import Joi from 'joi';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { fetchReview, fetchGreatMovie } from 'eberts-api';

dotenv.config();

const app = express();
const port = process.env.SERVER_PORT || 8080;
const uri = process.env.DB_HOST;
const client = new MongoClient(uri);
const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.API_KEY;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

client.connect();
const database = client.db(process.env.DB_NAME || 'mydb');
const movies = database.collection(process.env.COLLECTION || 'movies');

app.get('/titles/:title', async (req, res) => {
  const titleSchema = Joi.string().min(3);
  const validation = titleSchema.validate(req.params.title);
  if (!validation.error) {
    const cursor = movies.find({ title: new RegExp(req.params.title, 'i') });
    let results = [];
    await cursor.forEach((result) => {
      results.push(result);
    });
    res.status(200).send(results);
  } else
    res.status(400).json({
      message: process.env.VERBOSE
        ? validation.error.message
        : 'Invalid request',
    });
});

app.get('/title/id/:id', async (req, res) => {
  const titleSchema = Joi.string().alphanum().lowercase().length(24);
  const validation = titleSchema.validate(req.params.id);
  if (!validation.error) {
    const movie = await movies.findOne({ _id: ObjectId(req.params.id) });
    if (!movie) res.status(204).send();
    else res.status(200).send(movie);
  } else
    res.status(400).json({
      message: process.env.VERBOSE
        ? validation.error.message
        : 'Invalid request',
    });
});

app.get('/random-title', async (req, res) => {
  const results = await movies.find({});
  let temp = [];
  await results.forEach((result) => {
    temp.push(result);
  });
  res.status(200).send(temp[Math.floor(Math.random() * temp.length)]);
});

app.post('/add/title', async (req, res) => {
  let doc = {};
  req.query.title && (doc.title = req.query.title);
  req.query.format && (doc.format = req.query.format);
  req.query.color && (doc.color = req.query.color);
  req.query.length && (doc.length = req.query.length);
  req.query.year && (doc.year = req.query.year);
  req.query.language && (doc.language = req.query.language);
  req.query.director && (doc.director = req.query.director);
  req.query.label && (doc.label = req.query.label);
  req.query.actors &&
    req.query.actors.length !== 0 &&
    (doc.actors = req.query.actors);
  req.query.notes && (doc.notes = req.query.notes);
  const movie = await movies.findOne(doc);
  if (!movie) {
    const response = await movies.insertOne(doc);
    if (response.acknowledged) res.status(200).send(response);
    else {
      res.status(400).json({
        message: 'Error adding record to database',
      });
    }
  } else
    res.status(409).json({
      message: 'Record already exists',
    });
});

app.put('/edit/title', async (req, res) => {
  let doc = {};
  req.query.title && (doc.title = req.query.title);
  req.query.format && (doc.format = req.query.format);
  req.query.color && (doc.color = req.query.color);
  req.query.length && (doc.length = req.query.length);
  req.query.year && (doc.year = req.query.year);
  req.query.language && (doc.language = req.query.language);
  req.query.director && (doc.director = req.query.director);
  req.query.label && (doc.label = req.query.label);
  req.query.actors &&
    req.query.actors.length !== 0 &&
    (doc.actors = req.query.actors);
  req.query.notes && (doc.notes = req.query.notes);
  const response = await movies.replaceOne(
    { _id: ObjectId(req.query.id) },
    doc,
  );
  if (response.acknowledged) res.status(200).send(response);
  else
    res.status(400).json({
      message: 'Error adding record to database',
    });
});

app.delete('/title/:id', async (req, res) => {
  const response = await movies.deleteOne({ _id: ObjectId(req.params.id) });
  if (response.acknowledged) {
    res.status(200).json({ message: 'Record succesfully deleted' });
  } else {
    res.status(400).json({
      message: 'Error delete record from database',
    });
  }
});

app.get('/keyword-search/:keyword', async (req, res) => {
  fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${req.params.keyword}&page=1&include_adult=true`,
  )
    .then((response) => response.json())
    .then((json) => res.send(json.results));
});

app.get('/recommendations/:id', (req, res) => {
  fetch(
    `${BASE_URL}/movie/${req.params.id}/recommendations?api_key=${API_KEY}&language=en-US&query=${req.params.keyword}&page=1&include_adult=true`,
  )
    .then((response) => response.json())
    .then((json) => res.send(json));
});

app.get('/review/:title/:year', async (req, res) => {
  let result = await fetchReview(req.params.title, req.params.year);
  if (result.error) {
    result = await fetchGreatMovie(req.params.title, req.params.year);
    if (result.error) res.status(404).send(result.error);
  } else res.status(200).send(result);
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
