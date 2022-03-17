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
const verbose = process.env.VERBOSE === 'true';
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
      message: verbose ? validation.error.message : 'Invalid request',
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
      message: verbose ? validation.error.message : 'Invalid request',
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
      message: verbose ? validation.error.message : 'Invalid request',
    });
}

export async function getTitleById(req, res) {
  const movie = await movies.findOne({ _id: ObjectId(req.params.id) });
  if (!movie) res.status(204).send();
  else res.status(200).send(movie);
}

export async function getRandomTitle(req, res) {
  const results = await movies.find({});
  let temp = [];
  await results.forEach((result) => {
    temp.push(result);
  });
  res.status(200).send(temp[Math.floor(Math.random() * temp.length)]);
}

export async function getAllTitles(req, res) {
  let resultArr = [];
  const results = await movies.find({});
  await results.forEach((result) => {
    resultArr.push(result);
  });
  res.status(200).send(resultArr.sort((a, b) => (a.title > b.title ? 1 : -1)));
}

export async function addMovie(req, res) {
  const doc = removeEmptyFields(req);
  const movie = await movies.findOne({
    director: new RegExp(doc.director, 'i'),
    title: new RegExp(doc.title, 'i'),
    year: new RegExp(doc.year, 'i'),
  });
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
  let tempResult = [...result.data.results.splice(0, 8)];
  for (let result of tempResult) {
    let cursor = await movies.find({
      title: new RegExp(result.title, 'i'),
    });
    while (await cursor.hasNext()) {
      const doc = await cursor.next();
      if (doc) {
        result.inCollection = true;
        result.state = doc;
      }
    }
  }
  res.send(tempResult);
}

export async function getReview(req, res) {
  let result = await fetchReview(req.params.title, req.params.year);
  if (result.error) {
    result = await fetchGreatMovie(req.params.title, req.params.year);
    if (result.error) res.status(404).send(result.error);
  } else res.status(200).send(result);
}

export async function addRelease(req, res) {
  const doc = removeEmptyFields(req);
  if (!doc.releases) doc.releases = [];
  doc.releases.push({
    label: req.query.label,
    notes: req.query.releaseNotes,
    format: req.query.format,
  });
  const response = await movies.replaceOne(
    { _id: ObjectId(req.query._id) },
    doc,
  );
  if (response.acknowledged) res.status(200).send(doc.releases);
  else
    res.status(400).json({
      message: 'Error adding record to database',
    });
}

export async function deleteRelease(req, res) {
  const doc = removeEmptyFields(req);
  let tempReleases = [...doc.releases];
  tempReleases.splice(req.query.index, 1);
  doc.releases = tempReleases;
  const response = await movies.replaceOne(
    { _id: ObjectId(req.query._id) },
    doc,
  );
  if (response.acknowledged) res.status(200).send(doc.releases);
  else
    res.status(400).json({
      message: 'Error editing record in database',
    });
}

export async function getAllReleases(req, res) {
  let resultArr = [];
  const results = await movies.find({});
  await results.forEach((result) => {
    result.releases.forEach((release) => {
      resultArr.push({ title: result.title, id: result._id, release });
    });
  });
  res.status(200).send(resultArr.sort((a, b) => (a.title > b.title ? 1 : -1)));
}
