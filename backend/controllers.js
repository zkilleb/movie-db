import Joi from 'joi';
import dotenv from 'dotenv';
import { fetchReview, fetchGreatMovie } from 'eberts-api';
import axios from 'axios';
import { MongoClient, ObjectId } from 'mongodb';
import { removeEmptyFields, generateTMDBParams } from './util.js';

dotenv.config();

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.API_KEY;

const uri = process.env.DB_HOST;
const client = new MongoClient(uri);

client.connect();
const database = client.db(process.env.DB_NAME || 'mydb');
const movies = database.collection(process.env.COLLECTION || 'movies');

export async function getTitles(req, res) {
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
}

export async function getDirector(req, res) {
  const directorSchema = Joi.string().min(3);
  const validation = directorSchema.validate(req.params.name);
  if (!validation.error) {
    const cursor = movies.find({ director: new RegExp(req.params.name, 'i') });
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
}

export async function getActor(req, res) {
  const actorSchema = Joi.string().min(3);
  const validation = actorSchema.validate(req.params.name);
  if (!validation.error) {
    const cursor = movies.find({ actors: new RegExp(req.params.name, 'i') });
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
}

export async function getTitleById(req, res) {
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
}

export async function getRandomTitle(req, res) {
  const results = await movies.find({});
  let temp = [];
  await results.forEach((result) => {
    temp.push(result);
  });
  res.status(200).send(temp[Math.floor(Math.random() * temp.length)]);
}

export async function addMovie(req, res) {
  const doc = removeEmptyFields(req);
  const movie = await movies.findOne(doc);
  if (!movie) {
    const response = await movies.insertOne(doc);
    if (response.acknowledged) res.status(200).send(response);
    else {
      res.status(400).json({
        message: 'Error adding record to database',
      });
    }
  } else {
    res.status(409).json({
      message: 'Record already exists',
    });
  }
}

export async function editMovie(req, res) {
  const doc = removeEmptyFields(req);
  const response = await movies.replaceOne(
    { _id: ObjectId(req.query.id) },
    doc,
  );
  if (response.acknowledged) res.status(200).send(response);
  else
    res.status(400).json({
      message: 'Error adding record to database',
    });
}

export async function deleteMovie(req, res) {
  const response = await movies.deleteOne({ _id: ObjectId(req.params.id) });
  if (response.acknowledged) {
    res.status(200).json({ message: 'Record succesfully deleted' });
  } else {
    res.status(400).json({
      message: 'Error delete record from database',
    });
  }
}

export async function getTMDBKeyword(req, res) {
  const result = await axios.get(
    `${BASE_URL}/search/movie`,
    generateTMDBParams(req, API_KEY),
  );
  res.send(result.data.results);
}

export async function getTMDBKeywordByPerson(req, res) {
  const personResult = await axios.get(
    `${BASE_URL}/search/person`,
    generateTMDBParams(req, API_KEY),
  );
  if (personResult.data.results[0]) {
    let results = [];
    for (const person of personResult.data.results) {
      const result = await axios.get(
        `${BASE_URL}/person/${person.id}/movie_credits`,
        generateTMDBParams(req, API_KEY),
      );
      if (req.params.type === 'actor') results.push(result.data.cast);
      else results.push(result.data.crew);
    }
    res.send(results.flat());
  } else {
    res.status(204);
  }
}

export async function getRecommendations(req, res) {
  const result = await axios.get(
    `${BASE_URL}/movie/${req.params.id}/recommendations`,
    generateTMDBParams(req, API_KEY),
  );
  res.send(result.data.results);
}

export async function getReview(req, res) {
  let result = await fetchReview(req.params.title, req.params.year);
  if (result.error) {
    result = await fetchGreatMovie(req.params.title, req.params.year);
    if (result.error) res.status(404).send(result.error);
  } else res.status(200).send(result);
}

export async function addImage(req, res) {}
