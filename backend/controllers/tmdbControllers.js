import axios from 'axios';
import { generateTMDBParams } from '../util.js';
import { BASE_URL, API_KEY } from '../constants.js';
import { connectToDB } from '../db.js';

const movies = connectToDB();

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
