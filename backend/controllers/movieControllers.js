import Joi from 'joi';
import { ObjectId } from 'mongodb';
import { removeEmptyFields } from '../util.js';
import { verbose } from '../constants.js';
import { connectToDB } from '../db.js';

const movies = connectToDB();

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

export async function addRating(req, res) {
  try {
    movies.updateOne(
      { _id: ObjectId(req.query.id) },
      { $set: { rating: req.query.rating } },
      false,
    );
    res.status(200).json({ message: 'Rating succesfully added' });
  } catch (e) {
    res.status(400).json({ message: 'Error adding rating' });
  }
}
