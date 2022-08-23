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

export async function addBulkMovie(req, res) {
  let errors = [];
  const columns = [
    'title',
    'length',
    'year',
    'color',
    'language',
    'director',
    'studio',
    'notes',
    'genre',
  ];
  req.body.data.split('\n').forEach(async (movie, index) => {
    if (index !== 0 && movie !== '') {
      let doc = {};
      let fields = movie.split(', ');
      let errorFlag = false;
      for (let i = 0; i < fields.length; i++) {
        if (columns[i] === 'title' && fields[i] === '') {
          errors.push({ item: `Index ${index}`, reason: 'Title not provided' });
          errorFlag = true;
          break;
        } else if (columns[i] === 'director' && fields[i] === '') {
          errors.push({
            item: `Index ${index}`,
            reason: 'Director not provided',
          });
          errorFlag = true;
          break;
        }
        if (columns[i] === 'year' && fields[i] === '') {
          errors.push({ item: `Index ${index}`, reason: 'Year not provided' });
          break;
        } else if (
          columns[i] === 'color' &&
          fields[i] !== 'true' &&
          fields[i] !== 'false'
        ) {
          errors.push({
            item: `Index ${index}`,
            reason: 'Value for color must be true or false',
          });
          errorFlag = true;
          break;
        } else if (columns[i] === 'length' && !fields[i].match(/^[0-9]*$/)) {
          errors.push({
            item: `Index ${index}`,
            reason: 'Length must be a numeric value',
          });
          errorFlag = true;
          break;
        } else if (
          columns[i] === 'year' &&
          (!fields[i].match(/^[0-9]*$/) || fields[i].length !== 4)
        ) {
          errors.push({
            item: `Index ${index}`,
            reason: 'Year must be a numeric value and contain 4 characters',
          });
          errorFlag = true;
          break;
        }
        doc[columns[i]] = fields[i].replace(/\r/g, '');
      }
      if (!errorFlag) {
        const movie = await movies.findOne({
          director: new RegExp(doc.director, 'i'),
          title: new RegExp(doc.title, 'i'),
          year: new RegExp(doc.year, 'i'),
        });
        if (!movie) {
          const response = await movies.insertOne(doc);
          if (!response.acknowledged)
            errors.push({
              item: `Index ${index}`,
              reason: 'Problem writing record to database',
            });
        } else {
          errors.push({
            item: `Index ${index}`,
            reason: 'Record already exists',
          });
        }
      }
    }
  });
  res.status(200).json({
    message:
      errors.length === 0
        ? 'All titles added succesfully'
        : `Problem adding ${errors.length} record(s)`,
    errors,
  });
}
