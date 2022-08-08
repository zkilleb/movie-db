import { fetchReview, fetchGreatMovie } from 'eberts-api';
import { ObjectId } from 'mongodb';
import { connectToDB } from '../db.js';

const movies = connectToDB();

export async function getReview(req, res) {
  let result = await fetchReview(req.params.title, req.params.year);
  if (result.error) {
    result = await fetchGreatMovie(req.params.title, req.params.year);
    if (result.error) {
      movies.updateOne(
        { _id: ObjectId(req.params.id) },
        { $set: { review: 'Review not found' } },
        false,
      );
      res.status(404).send(result.error);
    }
  } else {
    movies.updateOne(
      { _id: ObjectId(req.params.id) },
      { $set: { review: result } },
      false,
    );
    res.status(200).send(result);
  }
}
