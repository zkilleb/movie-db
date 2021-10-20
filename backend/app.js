import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import Joi from 'joi';
import axios from 'axios';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

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
  next();
});

client.connect();
const database = client.db('mydb');
const movies = database.collection('movies');

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

app.post('/add/title', async (req, res) => {
  const doc = {
    title: req.query.title,
    format: req.query.format,
    color: req.query.color,
    length: req.query.length,
    year: req.query.year,
    language: req.query.language,
    director: req.query.director,
    label: req.query.label,
    actors: req.query.actors,
    notes: req.query.notes,
  };
  const response = await movies.insertOne(doc);
  res.send(response);
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

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
